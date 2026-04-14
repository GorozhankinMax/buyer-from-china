import "./TimelineSection.css";

const timelineItems = [
  {
    title: "Авиа доставка",
    lead: "3–7 дней",
    note: "от $15 / кг",
    size: "wide",
    tone: "bright",
    delay: "140ms",
  },
  {
    title: "Авто доставка",
    lead: "15–25 дней",
    note: "от $1 / кг",
    size: "tall",
    tone: "accent",
    delay: "240ms",
  },
  {
    title: "Поиск поставщика",
    lead: "1–3 дня",
    note: "на подбор фабрик и первичный контакт",
    size: "compact",
    tone: "soft",
    delay: "340ms",
  },
  {
    title: "Проверка и выкуп",
    lead: "от 1 дня",
    note: "в зависимости от объема и стадии сделки",
    size: "wide-low",
    tone: "soft",
    delay: "440ms",
  },
];

export default function TimelineSection() {
  return (
    <section className="timeline-section" aria-labelledby="timeline-title" id="timing">
      <div className="section__container timeline-section__container">
        <div className="timeline-editorial">
          <h2 className="timeline-section__title reveal-up" data-reveal id="timeline-title">
            Сроки и ориентиры
          </h2>

          <p className="timeline-section__subtitle reveal-up" data-reveal style={{ transitionDelay: "80ms" }}>
            Ориентиры по срокам и стоимости
          </p>

          <div className="timeline-grid" aria-label="Ориентиры по срокам и стоимости">
            {timelineItems.map((item) => (
              <article
                className={`timeline-card timeline-card--${item.size} timeline-card--${item.tone} reveal-up`}
                data-reveal
                key={item.title}
                style={{ transitionDelay: item.delay }}
              >
                <p className="timeline-card__title">{item.title}</p>
                <p className="timeline-card__lead">{item.lead}</p>
                <p className="timeline-card__note">{item.note}</p>
              </article>
            ))}
          </div>

          <p className="timeline-section__caption reveal-up" data-reveal style={{ transitionDelay: "560ms" }}>
            Индивидуальный расчет под ваш товар
          </p>
        </div>
      </div>
    </section>
  );
}
