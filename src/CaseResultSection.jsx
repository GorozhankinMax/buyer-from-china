import "./CaseResultSection.css";

const beforeMetrics = [
  { label: "Тариф", value: "3 $/кг" },
  { label: "Наценка на курс", value: "1,2%" },
  { label: "Стоимость сумки", value: "70 юаней" },
  { label: "Себестоимость шт", value: "935 ₽" },
  { label: "Себестоимость партии", value: "280 500 ₽" },
];

const actionItems = [
  {
    before: "3 $/кг",
    after: "1,6 $/кг",
    label: "нашли более выгодную логистику",
  },
  {
    before: "1,2%",
    after: "0,5%",
    label: "нашли более выгодный курс",
  },
  {
    before: "70 юаней",
    after: "68 юаней",
    label: "договорились с поставщиком",
  },
];

const afterMetrics = [
  { label: "Тариф", value: "1,6 $/кг" },
  { label: "Наценка на курс", value: "0,5%" },
  { label: "Стоимость сумки", value: "68 юаней" },
  { label: "Себестоимость шт", value: "865 ₽" },
  { label: "Себестоимость партии", value: "259 500 ₽" },
];

export default function CaseResultSection() {
  return (
    <section className="case-story section" aria-labelledby="case-story-title" id="cases">
      <div className="section__container case-story__container">
        <div className="case-story__intro reveal-up" data-reveal>
          <p className="case-story__eyebrow">Кейс</p>
          <h2 className="case-story__headline" id="case-story-title">
            Как мы снизили стоимость партии на <span>21 000 ₽</span>
          </h2>
          <p className="case-story__subheading">
            за счёт более выгодной логистики, курса и переговоров с поставщиком
          </p>
        </div>

        <section className="case-story__hero reveal-up" data-reveal style={{ transitionDelay: "80ms" }} aria-label="Результат кейса">
          <p className="case-story__hero-label">Сэкономили</p>
          <p className="case-story__hero-value">21 000 ₽</p>
          <p className="case-story__hero-note">на одной партии за 2 дня</p>

          <div className="case-story__hero-flow">
            <p className="case-story__hero-side">
              <span>280 500 ₽</span>
            </p>
            <p className="case-story__hero-arrow" aria-hidden="true">
              →
            </p>
            <p className="case-story__hero-side case-story__hero-side--accent">
              <span>259 500 ₽</span>
            </p>
          </div>
        </section>

        <div className="case-story__steps">
          <article className="case-step reveal-up" data-reveal style={{ transitionDelay: "140ms" }}>
            <div className="case-step__head">
              <p className="case-step__step">01</p>
              <h3 className="case-step__title">Было</h3>
              <p className="case-step__microcopy">Клиент переплачивал на каждом этапе</p>
            </div>

            <div className="case-line-list">
              {beforeMetrics.map((item) => (
                <p className="case-line" key={item.label}>
                  <span className="case-line__label">{item.label}</span>
                  <strong className="case-line__value">{item.value}</strong>
                </p>
              ))}
            </div>

            <div className="case-math">
              <p className="case-math__label">Себестоимость одной сумки</p>
              <p className="case-math__equation">
                850 ₽ + 85 ₽ = <strong>935 ₽</strong>
              </p>
              <p className="case-math__footnote">Партия в 300 сумок обходилась в 280 500 ₽</p>
            </div>
          </article>

          <article className="case-step reveal-up" data-reveal style={{ transitionDelay: "220ms" }}>
            <div className="case-step__head">
              <p className="case-step__step">02</p>
              <h3 className="case-step__title">Что мы сделали</h3>
            </div>

            <div className="case-action-list">
              {actionItems.map((item) => (
                <div className="case-action" key={item.label}>
                  <p className="case-action__numbers">
                    <span>{item.before}</span>
                    <span aria-hidden="true">→</span>
                    <strong>{item.after}</strong>
                  </p>
                  <p className="case-action__label">{item.label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="case-step reveal-up" data-reveal style={{ transitionDelay: "300ms" }}>
            <div className="case-step__head">
              <p className="case-step__step">03</p>
              <h3 className="case-step__title">Стало</h3>
              <p className="case-step__microcopy">Мы снизили все ключевые расходы</p>
            </div>

            <div className="case-line-list case-line-list--after">
              {afterMetrics.map((item) => (
                <p className="case-line case-line--after" key={item.label}>
                  <span className="case-line__label">{item.label}</span>
                  <strong className="case-line__value">{item.value}</strong>
                </p>
              ))}
            </div>

            <div className="case-math case-math--after">
              <p className="case-math__label">Новая себестоимость одной сумки</p>
              <p className="case-math__equation">
                820 ₽ + 45 ₽ = <strong>865 ₽</strong>
              </p>
              <p className="case-math__footnote">Партия в 300 сумок обошлась в 259 500 ₽</p>
            </div>
          </article>

          <article className="case-step case-step--result reveal-up" data-reveal style={{ transitionDelay: "380ms" }}>
            <div className="case-step__head">
              <p className="case-step__step">04</p>
              <h3 className="case-step__title">Итог</h3>
            </div>

            <div className="case-result">
              <p className="case-result__line">
                <span>Экономия с одной сумки</span>
                <strong>70 ₽</strong>
              </p>
              <p className="case-result__line">
                <span>Партия</span>
                <strong>300 шт</strong>
              </p>
              <div className="case-result__total">
                <p className="case-result__total-label">Итого</p>
                <p className="case-result__total-value">21 000 ₽</p>
                <p className="case-result__total-note">чистой экономии</p>
              </div>
            </div>

            <p className="case-story__final-note">
              После этого кейса клиент перешёл на постоянные поставки через нас
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
