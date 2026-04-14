import { useEffect, useRef, useState } from "react";
import "./SolveSection.css";

const solvePoints = [
  { text: "Прямые поставщики", align: "left", delay: "140ms", tone: "soft" },
  { text: "Скидки от поставщиков и лучшие тарифы", align: "right", delay: "240ms", tone: "accent" },
  { text: "Проверенные контакты в Китае", align: "center", delay: "340ms", tone: "strong" },
  { text: "Никаких сложных переговоров для вас", align: "left-wide", delay: "440ms", tone: "soft" },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function seededNoise(seed) {
  const value = Math.sin(seed * 127.1) * 43758.5453123;
  return value - Math.floor(value);
}

function randomBetween(seed, min, max) {
  return min + seededNoise(seed) * (max - min);
}

export default function SolveSection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const pointRefs = useRef([]);
  const isSectionVisibleRef = useRef(false);
  const [isNetworkVisible, setIsNetworkVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return undefined;
    }

    const particles = [];
    const anchors = [];
    const densitySpots = [];
    const voidSpots = [];
    const mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = 0;

    const isMobile = () => window.innerWidth <= 640;
    const isCompactLayout = () => window.innerWidth <= 900;
    const getParticleCount = () => (isMobile() ? 126 : 190);
    const getInteractionRadius = () => (isMobile() ? 114 : 144);
    const getBaseConnectionDistance = () => (isMobile() ? 100 : 134);

    const captureAnchors = () => {
      const nextAnchors = [];
      const collect = [
        { key: "title", element: titleRef.current, radius: isMobile() ? 170 : 230, weight: 1.22 },
        { key: "subtitle", element: subtitleRef.current, radius: isMobile() ? 116 : 156, weight: 0.5 },
      ];

      solvePoints.forEach((point, index) => {
        collect.push({
          key: `point-${index}`,
          element: pointRefs.current[index],
          radius: point.align === "center" ? (isMobile() ? 126 : 168) : isMobile() ? 112 : 148,
          weight: point.align === "center" ? 0.98 : 0.82,
        });
      });

      collect.forEach((item) => {
        if (!item.element) {
          return;
        }

        const rect = item.element.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        nextAnchors.push({
          id: item.key,
          x: rect.left - (isCompactLayout() ? sectionRect.left : 0) + rect.width * 0.5,
          y: rect.top - (isCompactLayout() ? sectionRect.top : 0) + rect.height * 0.5,
          radius: item.radius,
          weight: item.weight,
        });
      });

      anchors.length = 0;
      anchors.push(...nextAnchors);
    };

    const buildAmbientFields = () => {
      densitySpots.length = 0;
      voidSpots.length = 0;

      const denseCount = isMobile() ? 3 : 5;
      const voidCount = isMobile() ? 2 : 3;

      for (let index = 0; index < denseCount; index += 1) {
        densitySpots.push({
          x: randomBetween(index * 6.31 + width * 0.001, width * 0.08, width * 0.92),
          y: randomBetween(index * 8.17 + height * 0.001, height * 0.1, height * 0.9),
          radius: randomBetween(index * 9.7 + 2.3, isMobile() ? 96 : 124, isMobile() ? 152 : 196),
          weight: randomBetween(index * 4.9 + 1.1, 0.2, 0.42),
        });
      }

      for (let index = 0; index < voidCount; index += 1) {
        voidSpots.push({
          x: randomBetween(index * 7.93 + width * 0.002, width * 0.12, width * 0.88),
          y: randomBetween(index * 10.37 + height * 0.002, height * 0.14, height * 0.86),
          radius: randomBetween(index * 5.27 + 3.7, isMobile() ? 72 : 92, isMobile() ? 118 : 148),
          weight: randomBetween(index * 3.41 + 4.6, 0.24, 0.46),
        });
      }
    };

    const getFieldDensity = (x, y) => {
      let boost = 0.18;

      for (let index = 0; index < anchors.length; index += 1) {
        const anchor = anchors[index];
        const dx = x - anchor.x;
        const dy = y - anchor.y;
        const distance = Math.hypot(dx, dy);

        if (distance >= anchor.radius) {
          continue;
        }

        const force = 1 - distance / anchor.radius;
        boost += force * force * anchor.weight;
      }

      for (let index = 0; index < densitySpots.length; index += 1) {
        const spot = densitySpots[index];
        const distance = Math.hypot(x - spot.x, y - spot.y);

        if (distance >= spot.radius) {
          continue;
        }

        const force = 1 - distance / spot.radius;
        boost += force * force * spot.weight;
      }

      for (let index = 0; index < voidSpots.length; index += 1) {
        const spot = voidSpots[index];
        const distance = Math.hypot(x - spot.x, y - spot.y);

        if (distance >= spot.radius) {
          continue;
        }

        const force = 1 - distance / spot.radius;
        boost -= force * force * spot.weight;
      }

      return clamp(boost, 0.04, 1.38);
    };

    const sampleParticlePosition = (index, total) => {
      let bestX = width * 0.5;
      let bestY = height * 0.5;
      let bestDensity = 0;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const seed = index * 11.73 + attempt * 17.29 + total * 0.13;
        const x = randomBetween(seed, 14, width - 14);
        const y = randomBetween(seed + 3.7, 18, height - 18);
        const density = getFieldDensity(x, y);
        const acceptance = 0.28 + density * 0.48;

        if (density > bestDensity) {
          bestDensity = density;
          bestX = x;
          bestY = y;
        }

        if (seededNoise(seed + 8.4) < acceptance) {
          return { x, y, density };
        }
      }

      return { x: bestX, y: bestY, density: bestDensity };
    };

    const createParticle = (index, total) => {
      const sampled = sampleParticlePosition(index, total);
      const baseX = sampled.x;
      const baseY = sampled.y;
      const density = sampled.density;

      return {
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        density,
        size: 0.68 + density * 0.24 + seededNoise(index * 2.43) * 0.34,
        driftPhaseX: index * 0.64,
        driftPhaseY: index * 0.92,
        driftRadiusX: 0.9 + density * 0.8 + seededNoise(index * 3.83) * 0.9,
        driftRadiusY: 0.8 + density * 0.7 + seededNoise(index * 5.17) * 0.8,
      };
    };

    const syncCanvas = () => {
      const sectionRect = section.getBoundingClientRect();
      width = Math.max(1, Math.round(isCompactLayout() ? sectionRect.width : window.innerWidth));
      height = Math.max(1, Math.round(isCompactLayout() ? sectionRect.height : window.innerHeight));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      captureAnchors();
      buildAmbientFields();
      particles.length = 0;

      const particleCount = getParticleCount();
      for (let index = 0; index < particleCount; index += 1) {
        particles.push(createParticle(index, particleCount));
      }
    };

    const handlePointerMove = (event) => {
      if (isCompactLayout()) {
        const sectionRect = section.getBoundingClientRect();
        mouse.x = event.clientX - sectionRect.left;
        mouse.y = event.clientY - sectionRect.top;
      } else {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      }
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const getSectionFade = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const fadeDistance = viewportHeight * 0.22;
      const fadeIn = clamp((viewportHeight - rect.top) / fadeDistance, 0, 1);
      const fadeOut = clamp(rect.bottom / fadeDistance, 0, 1);

      return {
        rect,
        visibility: Math.min(fadeIn, fadeOut),
      };
    };

    const getEdgeFadeAtY = (y, rect) => {
      const fadeBand = Math.max(rect.height * 0.18, 84);
      const topFade = clamp((isCompactLayout() ? y : y - rect.top) / fadeBand, 0, 1);
      const bottomFade = clamp((isCompactLayout() ? rect.height - y : rect.bottom - y) / fadeBand, 0, 1);
      return Math.min(topFade, bottomFade);
    };

    const render = (timestamp) => {
      context.clearRect(0, 0, width, height);

      if (!isSectionVisibleRef.current) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      const driftTime = timestamp * 0.00016;
      const interactionRadius = getInteractionRadius();
      const baseConnectionDistance = getBaseConnectionDistance();
      const linksPerParticle = new Uint8Array(particles.length);
      const sectionFade = getSectionFade();
      const sectionVisibility = isCompactLayout() ? 1 : sectionFade.visibility;
      const sectionRect = sectionFade.rect;

      if (sectionVisibility <= 0.001) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const driftX = Math.sin(driftTime + particle.driftPhaseX) * particle.driftRadiusX;
        const driftY = Math.cos(driftTime + particle.driftPhaseY) * particle.driftRadiusY;
        const targetBaseX = particle.baseX + driftX;
        const targetBaseY = particle.baseY + driftY;

        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0.001 && distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            const pull = force * force * (4.1 + particle.density * 1.4);
            particle.x += (dx / distance) * pull;
            particle.y += (dy / distance) * pull;
          }
        }

        particle.x += (targetBaseX - particle.x) * 0.041;
        particle.y += (targetBaseY - particle.y) * 0.041;
      }

      context.shadowBlur = 0;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const particleLinkLimit = isMobile() ? 4 : 5;

        if (linksPerParticle[index] >= particleLinkLimit) {
          continue;
        }

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const nextParticle = particles[nextIndex];

          if (linksPerParticle[index] >= particleLinkLimit || linksPerParticle[nextIndex] >= particleLinkLimit) {
            continue;
          }

          const dx = nextParticle.x - particle.x;
          const dy = nextParticle.y - particle.y;
          const distance = Math.hypot(dx, dy);
          const localDensity = (particle.density + nextParticle.density) * 0.5;
          const connectionDistance = baseConnectionDistance + localDensity * (isMobile() ? 24 : 34);

          if (distance >= connectionDistance) {
            continue;
          }

          const distanceForce = 1 - distance / connectionDistance;
          const midX = (particle.x + nextParticle.x) * 0.5;
          const midY = (particle.y + nextParticle.y) * 0.5;
          let cursorBoost = 0;

          if (mouse.active) {
            const cursorDistance = Math.hypot(mouse.x - midX, mouse.y - midY);
            cursorBoost = clamp(1 - cursorDistance / (interactionRadius * 1.16), 0, 1);
          }

          const edgeFade = getEdgeFadeAtY(midY, sectionRect);
          const opacity =
            (0.011 + localDensity * 0.02 + distanceForce * (0.062 + localDensity * 0.072) + cursorBoost * 0.092) *
            edgeFade *
            sectionVisibility;

          if (opacity < 0.018) {
            continue;
          }

          const accentLine = seededNoise(index * 37.1 + nextIndex * 19.7) > 0.972;
          context.lineWidth = accentLine ? 1.04 : 0.66;
          context.strokeStyle = `rgba(118, 236, 186, ${opacity})`;
          if (accentLine) {
            context.strokeStyle = `rgba(156, 255, 212, ${Math.min(opacity + 0.07, 0.25)})`;
          }
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(nextParticle.x, nextParticle.y);
          context.stroke();

          linksPerParticle[index] += 1;
          linksPerParticle[nextIndex] += 1;
        }
      }

      context.shadowBlur = 5;
      context.shadowColor = "rgba(136, 255, 201, 0.1)";

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        let cursorBoost = 0;

        if (mouse.active) {
          const cursorDistance = Math.hypot(mouse.x - particle.x, mouse.y - particle.y);
          cursorBoost = clamp(1 - cursorDistance / interactionRadius, 0, 1);
        }

        const edgeFade = getEdgeFadeAtY(particle.y, sectionRect);
        const alpha = (0.052 + particle.density * 0.072 + cursorBoost * 0.18) * edgeFade * sectionVisibility;
        const size = particle.size + cursorBoost * 0.2;

        if (alpha < 0.01) {
          continue;
        }

        context.fillStyle = `rgba(224, 255, 237, ${alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;
      animationFrameId = window.requestAnimationFrame(render);
    };

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        isSectionVisibleRef.current = isVisible;
        setIsNetworkVisible(isVisible);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    syncCanvas();
    animationFrameId = window.requestAnimationFrame(render);
    sectionObserver.observe(section);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", syncCanvas);

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", syncCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="solve-section" aria-labelledby="solve-title" id="solution" ref={sectionRef}>
      <canvas className={`solve-section__particles ${isNetworkVisible ? "solve-section__particles--visible" : ""}`} ref={canvasRef} aria-hidden="true" />

      <div className="section__container solve-section__container">
        <div className="solve-editorial">
          <h2 className="solve-section__title reveal-up" data-reveal id="solve-title" ref={titleRef}>
            Мы решаем это
          </h2>

          <p className="solve-section__subtitle reveal-up" data-reveal style={{ transitionDelay: "80ms" }} ref={subtitleRef}>
            <span>Вы просто получаете результат</span>
          </p>

          <div className="solve-points" aria-label="Преимущества работы">
            {solvePoints.map((point, index) => (
              <p
                className={`solve-point solve-point--${point.align} solve-point--${point.tone} reveal-up`}
                data-reveal
                key={point.text}
                ref={(element) => {
                  pointRefs.current[index] = element;
                }}
                style={{ transitionDelay: point.delay }}
              >
                <span>{point.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
