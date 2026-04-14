import "./MapSection.css";
import { worldMapPaths } from "./worldMapData";

const highlightedCountries = new Set(["CHN", "RUS", "KAZ", "MNG", "BLR", "POL", "DEU", "TUR", "UKR"]);
const focusedCountries = new Set([
  "CHN",
  "RUS",
  "MNG",
  "KAZ",
  "KGZ",
  "TJK",
  "UZB",
  "TKM",
  "AFG",
  "PAK",
  "IND",
  "NPL",
  "BTN",
  "MMR",
  "LAO",
  "VNM",
  "THA",
  "KHM",
  "PRK",
  "KOR",
  "JPN",
  "GEO",
  "ARM",
  "AZE",
  "BLR",
  "UKR",
  "POL",
  "DEU",
  "CZE",
  "SVK",
  "HUN",
  "ROU",
  "MDA",
  "LTU",
  "LVA",
  "EST",
  "FIN",
  "TUR",
  "IRN",
]);

export default function MapSection() {
  return (
    <section className="map-section" aria-labelledby="map-title">
      <div className="section__container map-section__container">
        {/* Заголовок логистического блока */}
        <div className="section-heading map-section__heading reveal-up" data-reveal>
          <p className="section-heading__eyebrow">Global route</p>
          <h2 className="section-heading__title map-section__title" id="map-title">
            Международная логистика без лишних звеньев
          </h2>
          <p className="map-section__subtitle">
            Выстраиваем прямой маршрут от поставщика в Китае до вашего склада
          </p>
        </div>

        {/* Реальная inline SVG-карта из geo-данных */}
        <div className="map-showcase reveal-up" data-reveal>
          <div className="map-showcase__frame">
            <svg
              className="world-map"
              viewBox="0 0 1440 700"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Logistics world map"
              role="img"
            >
              <defs>
                <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00c853" />
                  <stop offset="100%" stopColor="#52ff9a" />
                </linearGradient>
              </defs>

              {/* Тонкая технологичная сетка */}
              {/* Приближенный фрагмент карты: Россия, Китай и маршрут доставки */}
              <g className="map-viewport">
                <g className="map-grid" opacity="0.12">
                  <line x1="720" y1="118" x2="1320" y2="118" />
                  <line x1="720" y1="230" x2="1320" y2="230" />
                  <line x1="720" y1="342" x2="1320" y2="342" />
                  <line x1="720" y1="454" x2="1320" y2="454" />
                  <line x1="720" y1="566" x2="1320" y2="566" />

                  <line x1="760" y1="96" x2="760" y2="596" />
                  <line x1="900" y1="96" x2="900" y2="596" />
                  <line x1="1040" y1="96" x2="1040" y2="596" />
                  <line x1="1180" y1="96" x2="1180" y2="596" />
                  <line x1="1320" y1="96" x2="1320" y2="596" />
                </g>

                <g className="map-lands" aria-hidden="true">
                  {worldMapPaths
                    .filter((shape) => focusedCountries.has(shape.id))
                    .map((shape) => (
                    <path
                      className={`continent ${highlightedCountries.has(shape.id) ? "continent--key" : ""}`}
                      d={shape.d}
                      key={shape.id}
                    />
                    ))}
                </g>

                {/* Маршрут Китай -> зона назначения */}
                <path
                  className="route route-core"
                  d="M1088 246 C1052 226 1007 207 966 193 C926 179 889 175 850 184"
                  pathLength="100"
                />

                <path
                  className="route route-glow"
                  d="M1088 246 C1052 226 1007 207 966 193 C926 179 889 175 850 184"
                  pathLength="100"
                />

                {/* Аккуратная иконка самолета на линии */}
                <g className="plane" transform="translate(980 202) rotate(-16)">
                  <path d="M0,-8 L18,0 L0,8 L4,1 L-10,1 L-10,-1 L4,-1 Z" />
                </g>

                {/* Стартовая точка в Китае */}
                <g className="point point-start" transform="translate(1088 246)">
                  <circle className="pulse" r="18" />
                  <circle className="dot" r="6" />
                </g>
                <text x="1112" y="236" className="map-label map-label--end">
                  Китай
                </text>

                {/* Точка назначения в зоне Европы / склада */}
                <g className="point point-end" transform="translate(850 184)">
                  <circle className="pulse" r="18" />
                  <circle className="dot" r="6" />
                </g>
                <text x="724" y="172" className="map-label strong">
                  Точка назначения
                </text>
                <text x="724" y="200" className="map-sub">
                  Ваш склад
                </text>
              </g>

              {/* UI-детали под картой */}
              <text x="694" y="640" className="map-note">
                ПРЯМОЙ МАРШРУТ. ПРОЗРАЧНЫЙ ПРОЦЕСС. ПРЕДСКАЗУЕМЫЕ СРОКИ.
              </text>
              <text x="878" y="674" className="map-note small">
                7-14 ДНЕЙ В СРЕДНЕМ НА ДОСТАВКУ
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
