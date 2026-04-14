import { useEffect, useRef, useState } from "react";
import "./PainSection.css";

const painLines = [
  { text: "Переплачиваешь за курсы валют?", align: "left", tone: "secondary" },
  { text: "Не знаешь, кому в Китае можно доверять?", align: "right", tone: "background" },
  { text: "Боишься получить брак вместо прибыли?", align: "left-tight", tone: "primary" },
  { text: "Теряешь время на поиск поставщиков и логистов?", align: "right-tight", tone: "secondary" },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function PainSection() {
  const sectionRef = useRef(null);
  const lineRefs = useRef([]);
  const lastScrollYRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineStates, setLineStates] = useState(() => painLines.map(() => false));

  useEffect(() => {
    const updateState = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY >= lastScrollYRef.current ? "down" : "up";
      lastScrollYRef.current = currentScrollY;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const revealLineY = viewportHeight * 0.72;
      const focusY = viewportHeight * 0.42;
      let nextActiveIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      lineRefs.current.forEach((lineElement, index) => {
        if (!lineElement) {
          return;
        }

        const lineRect = lineElement.getBoundingClientRect();
        const lineCenter = lineRect.top + lineRect.height * 0.5;
        const distance = Math.abs(lineCenter - focusY);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextActiveIndex = index;
        }
      });

      setActiveIndex(nextActiveIndex);
      setLineStates(
        painLines.map((_, index) => {
          const lineElement = lineRefs.current[index];

          if (!lineElement) {
            return false;
          }

          if (scrollDirection === "up") {
            return true;
          }

          const lineRect = lineElement.getBoundingClientRect();
          return lineRect.top <= revealLineY;
        }),
      );
    };

    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  return (
    <section className="pain-section" aria-labelledby="pain-title" ref={sectionRef}>
      <div className="section__container pain-section__container">
        <div className="pain-editorial">
          <h2 className="pain-section__sr-only" id="pain-title">
            Основные боли клиента при закупке в Китае
          </h2>

          <div className="pain-lines" aria-hidden="true">
            {painLines.map((line, index) => {
              const state = index === activeIndex ? "active" : line.tone;

              return (
                <p
                  className={`pain-line pain-line--${line.align} pain-line--${state} ${lineStates[index] ? "pain-line--shown" : ""}`}
                  key={line.text}
                  ref={(element) => {
                    lineRefs.current[index] = element;
                  }}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
