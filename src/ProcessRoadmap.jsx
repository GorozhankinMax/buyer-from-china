import { useEffect, useMemo, useRef, useState } from "react";
import "./ProcessRoadmap.css";

const steps = [
  { number: "1", title: "Заявка", text: "Вы отправляете товар или идею" },
  { number: "2", title: "Поиск", text: "Находим поставщиков напрямую" },
  { number: "3", title: "Согласование", text: "Добиваемся лучшей цены" },
  { number: "4", title: "Выкуп", text: "Берем процесс на себя" },
  { number: "5", title: "Доставка", text: "Вы получаете товар без лишних действий" },
];

const digitImages = {
  1: "/1.png",
  2: "/2.png",
  3: "/3.png",
  4: "/4.png",
  5: "/5.png",
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function connectorVariance(index, seed) {
  return Math.sin((index + 1) * 12.9898 + seed * 78.233);
}

function buildDesktopPath(start, end, direction, index) {
  const deltaX = Math.abs(end.x - start.x);
  const deltaY = end.y - start.y;
  const directionSign = direction === "right" ? 1 : -1;
  const spread = Math.max(deltaX * (0.34 + ((connectorVariance(index, 0.18) + 1) * 0.5) * 0.07), 140);
  const exitBias = 0.18 + ((connectorVariance(index, 0.36) + 1) * 0.5) * 0.08;
  const entryBias = 0.74 + ((connectorVariance(index, 0.62) + 1) * 0.5) * 0.08;
  const crestOffset = connectorVariance(index, 0.84) * Math.min(Math.abs(deltaY) * 0.04, 14);
  const firstControl = {
    x: start.x + directionSign * spread,
    y: start.y + deltaY * exitBias,
  };
  const secondControl = {
    x: end.x - directionSign * spread,
    y: start.y + deltaY * entryBias + crestOffset,
  };

  return `M ${start.x} ${start.y} C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${end.x} ${end.y}`;
}

function buildMobilePath(start, end, index) {
  const deltaY = end.y - start.y;
  const horizontalDrift = connectorVariance(index, 0.27) * 18;
  const firstControl = {
    x: start.x + horizontalDrift,
    y: start.y + deltaY * (0.28 + ((connectorVariance(index, 0.49) + 1) * 0.5) * 0.08),
  };
  const secondControl = {
    x: end.x + connectorVariance(index, 0.73) * 18,
    y: start.y + deltaY * (0.76 + ((connectorVariance(index, 0.91) + 1) * 0.5) * 0.06),
  };

  return `M ${start.x} ${start.y} C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${end.x} ${end.y}`;
}

function getCardState(progress, index, totalCards) {
  const timeline = progress * (totalCards * 2 - 1);
  const cardStart = index * 2;

  if (timeline < cardStart) {
    return "inactive";
  }

  if (timeline < cardStart + 1) {
    return "active";
  }

  if (index === totalCards - 1 && timeline < totalCards * 2 - 1) {
    return "active";
  }

  return "completed";
}

function getConnectorProgress(progress, index, totalCards) {
  const timeline = progress * (totalCards * 2 - 1);
  const nextCardStart = index * 2 + 2;
  const maxTimeline = totalCards * 2 - 1;
  const remainingSpace = Math.max(maxTimeline - nextCardStart - 1, 0);
  const drawDelay = Math.min(0.28, remainingSpace * 0.24);
  const drawStart = nextCardStart + drawDelay;
  const drawDuration = Math.max(1 - drawDelay, 0.72);
  return clamp((timeline - drawStart) / drawDuration, 0, 1);
}

export default function ProcessRoadmap() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const measurePathsRef = useRef(() => {});
  const [progress, setProgress] = useState(0);
  const [paths, setPaths] = useState({ desktop: [], mobile: [], width: 0, height: 0 });

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.84;
      const distance = rect.height * 0.78 + viewportHeight * 0.04;
      const next = clamp((start - rect.top) / distance, 0, 1);

      setProgress((current) => (Math.abs(current - next) > 0.001 ? next : current));
      frameId = 0;
    };

    const requestTick = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let frameId = 0;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const cards = cardRefs.current.filter(Boolean);

      if (cards.length !== steps.length) return;

      const nextDesktop = [];
      const nextMobile = [];

      for (let index = 0; index < cards.length - 1; index += 1) {
        const currentRect = cards[index].getBoundingClientRect();
        const nextRect = cards[index + 1].getBoundingClientRect();
        const currentIsLeft = index % 2 === 0;

        const desktopStart = {
          x: currentIsLeft ? currentRect.right - stageRect.left - 18 : currentRect.left - stageRect.left + 18,
          y: currentRect.top - stageRect.top + currentRect.height * 0.56,
        };

        const desktopEnd = {
          x: currentIsLeft ? nextRect.left - stageRect.left + 18 : nextRect.right - stageRect.left - 18,
          y: nextRect.top - stageRect.top + nextRect.height * 0.44,
        };

        const mobileStart = {
          x: currentRect.left - stageRect.left + currentRect.width * 0.5,
          y: currentRect.bottom - stageRect.top - 1,
        };

        const mobileEnd = {
          x: nextRect.left - stageRect.left + nextRect.width * 0.5,
          y: nextRect.top - stageRect.top + 1,
        };

        nextDesktop.push(buildDesktopPath(desktopStart, desktopEnd, currentIsLeft ? "right" : "left", index));
        nextMobile.push(buildMobilePath(mobileStart, mobileEnd, index));
      }

      setPaths({
        desktop: nextDesktop,
        mobile: nextMobile,
        width: stageRect.width,
        height: stageRect.height,
      });

      frameId = 0;
    };

    const requestMeasure = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(measure);
    };

    measurePathsRef.current = requestMeasure;

    requestMeasure();

    const resizeObserver = new ResizeObserver(requestMeasure);
    resizeObserver.observe(stage);
    cardRefs.current.forEach((card) => {
      if (card) resizeObserver.observe(card);
    });

    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    measurePathsRef.current();
  }, [progress]);

  const headingVisible = progress > 0.02;

  const cards = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        state: getCardState(progress, index, steps.length),
        alignClass: index % 2 === 0 ? "roadmap-card--left" : "roadmap-card--right",
      })),
    [progress],
  );

  return (
    <section className="section roadmap-section" aria-labelledby="workflow-title" id="workflow" ref={sectionRef}>
      <div className="section__container roadmap-section__container">
        <div className={`section-heading roadmap-section__heading ${headingVisible ? "roadmap-section__heading--visible" : ""}`}>
          <p className="section-heading__eyebrow">КАК РАБОТАЕМ</p>
          <h2 className="section-heading__title" id="workflow-title">
            Пять шагов от заявки до доставки
          </h2>
        </div>

        <div className="roadmap-stage" ref={stageRef}>
          <svg
            className="roadmap-stage__svg roadmap-stage__svg--desktop"
            viewBox={`0 0 ${Math.max(paths.width, 1)} ${Math.max(paths.height, 1)}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="roadmapGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {paths.desktop.map((path, index) => {
              const connectorProgress = getConnectorProgress(progress, index, steps.length);

              return (
                <g className="roadmap-connector" key={`desktop-${index}`}>
                  <path className="roadmap-connector__base" d={path} pathLength="1" />
                  <path
                    className="roadmap-connector__glow"
                    d={path}
                    pathLength="1"
                    style={{ strokeDasharray: `${connectorProgress} 1`, strokeDashoffset: 0 }}
                    filter="url(#roadmapGlow)"
                  />
                  <path
                    className="roadmap-connector__active"
                    d={path}
                    pathLength="1"
                    style={{ strokeDasharray: `${connectorProgress} 1`, strokeDashoffset: 0 }}
                    filter="url(#roadmapGlow)"
                  />
                </g>
              );
            })}
          </svg>

          <svg
            className="roadmap-stage__svg roadmap-stage__svg--mobile"
            viewBox={`0 0 ${Math.max(paths.width, 1)} ${Math.max(paths.height, 1)}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="roadmapGlowMobile" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {paths.mobile.map((path, index) => {
              const connectorProgress = getConnectorProgress(progress, index, steps.length);

              return (
                <g className="roadmap-connector" key={`mobile-${index}`}>
                  <path className="roadmap-connector__base" d={path} pathLength="1" />
                  <path
                    className="roadmap-connector__glow"
                    d={path}
                    pathLength="1"
                    style={{ strokeDasharray: `${connectorProgress} 1`, strokeDashoffset: 0 }}
                    filter="url(#roadmapGlowMobile)"
                  />
                  <path
                    className="roadmap-connector__active"
                    d={path}
                    pathLength="1"
                    style={{ strokeDasharray: `${connectorProgress} 1`, strokeDashoffset: 0 }}
                    filter="url(#roadmapGlowMobile)"
                  />
                </g>
              );
            })}
          </svg>

          <div className="roadmap-list" data-reveal-group>
            {cards.map((step, index) => (
              <article
                className={`roadmap-card glass-card reveal-up ${step.alignClass}`}
                data-reveal
                data-state={step.state}
                key={step.number}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="roadmap-card__content">
                  <h3 className="roadmap-card__title">{step.title}</h3>
                  <p className="roadmap-card__text">{step.text}</p>
                </div>
                <span className="roadmap-card__number" aria-hidden="true" style={{ "--digit-image": `url(${digitImages[step.number]})` }}>
                  <span className="roadmap-card__number-shape" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
