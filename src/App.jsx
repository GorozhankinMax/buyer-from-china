import { useEffect, useState } from "react";
import PainSection from "./PainSection";
import ProcessRoadmap from "./ProcessRoadmap";
import SolveSection from "./SolveSection";
import TimelineSection from "./TimelineSection";
import CaseResultSection from "./CaseResultSection";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const services = [
  {
    icon: "01",
    title: "Поиск поставщиков",
    text: "Подбираем фабрики и компании под ваш продукт, бюджет и нужный объем.",
  },
  {
    icon: "02",
    title: "Проверка качества",
    text: "Контролируем образцы, производство, упаковку и соответствие вашим требованиям.",
  },
  {
    icon: "03",
    title: "Сопровождение сделки",
    text: "Берем на себя переговоры, согласование условий и сопровождение оплаты.",
  },
  {
    icon: "04",
    title: "Логистика под ключ",
    text: "Организуем выкуп, консолидацию, документы и доставку до вашего города.",
  },
];

const cases = [
  {
    title: "Товары для маркетплейсов",
    result: "32%",
    text: "Снизили закупочную стоимость партии бытовых товаров.",
    term: "Срок поставки: 12 дней",
  },
  {
    title: "Электроника",
    result: "18 дней",
    text: "Собрали поставку из нескольких фабрик в одну отгрузку.",
    term: "Полный цикл от поиска до получения",
  },
  {
    title: "Упаковка и расходники",
    result: "3X",
    text: "Увеличили объем закупки без просадки по качеству.",
    term: "Рост объема за 2 месяца работы",
  },
];

const heroNav = [
  { label: "Решение", href: "#solution" },
  { label: "Сроки и цены", href: "#timing" },
  { label: "Этапы", href: "#workflow" },
  { label: "Кейсы", href: "#cases" },
];

const sideContacts = [
  { label: "Telegram", href: "https://t.me/maksgorozhankin", icon: "telegram" },
  { label: "Телефон", href: "tel:+79040245342", icon: "phone" },
  { label: "Вконтакте", href: "https://vk.com/maknaggets_77", icon: "vk" },
];

const contactChannels = [
  { value: "phone", label: "Телефон" },
  { value: "telegram", label: "Телеграм" },
  { value: "vk", label: "Вконтакте" },
  { value: "email", label: "Почта" },
];

const currencyOptions = [
  { value: "usd", label: "USD" },
  { value: "cny", label: "CNY" },
];

const initialSubmitState = {
  status: "idle",
  message: "",
};

function HeaderIcon({ icon }) {
  if (icon === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.2 5.04 4.7 11.02c-1.06.42-1.05 1.01-.19 1.28l3.98 1.24 1.53 4.87c.2.61.1.86.75.86.5 0 .72-.23 1-.5l1.91-1.86 3.97 2.93c.73.4 1.26.2 1.44-.68l2.64-12.46c.26-1.08-.41-1.57-1.27-1.18Zm-10.98 8.22 9.33-5.89c.47-.29.9-.13.55.18l-7.69 6.94-.3 3.19-1.89-4.42Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7.24 4.17c.43-.47 1.02-.72 1.65-.67l2.14.17c.56.04 1.04.42 1.22.95l.72 2.16c.16.47.05.98-.28 1.35l-1.12 1.24a1 1 0 0 0-.18 1.06c.7 1.54 1.96 2.8 3.5 3.5a1 1 0 0 0 1.06-.18l1.24-1.12c.37-.33.88-.44 1.35-.28l2.16.72c.53.18.91.66.95 1.22l.17 2.14c.05.63-.2 1.22-.67 1.65l-1.43 1.3c-.82.74-1.99 1.02-3.06.72-3.2-.88-6.11-3-8.36-5.93-2.25-2.93-3.48-6.3-3.4-9.62.03-1.11.5-2.14 1.33-2.89l1.29-1.3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "vk") {
    return <img className="side-header__icon-vk" src="/vk.png" alt="" aria-hidden="true" />;
  }

  return null;
}

export default function App() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [heroFadeProgress, setHeroFadeProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedContactChannel, setSelectedContactChannel] = useState("");
  const [isContactChannelOpen, setIsContactChannelOpen] = useState(false);
  const [calculatorSubmitState, setCalculatorSubmitState] = useState(initialSubmitState);
  const [contactSubmitState, setContactSubmitState] = useState(initialSubmitState);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeDistance = Math.max(window.innerHeight * 0.72, 1);

      setIsHeaderVisible(scrollY > 24);
      setHeroFadeProgress(Math.min(scrollY / fadeDistance, 1));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollDirection = "down";

    const trackScrollDirection = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        scrollDirection = "down";
      } else if (currentScrollY < lastScrollY) {
        scrollDirection = "up";
      }

      lastScrollY = currentScrollY;
    };

    const getRevealGroup = (element) => {
      const explicitGroup = element.closest("[data-reveal-group]");

      if (explicitGroup) {
        return Array.from(explicitGroup.querySelectorAll("[data-reveal]"));
      }

      let current = element.parentElement;

      while (current && current !== document.body) {
        const groupItems = Array.from(current.querySelectorAll("[data-reveal]"));

        if (groupItems.length > 1 && groupItems.includes(element)) {
          return groupItems;
        }

        current = current.parentElement;
      }

      return [element];
    };

    const getDelayValue = (element) => {
      if (!element.dataset.baseDelay) {
        element.dataset.baseDelay = element.style.transitionDelay || "0ms";
      }

      const parsedDelay = Number.parseFloat(element.dataset.baseDelay);
      return Number.isFinite(parsedDelay) ? parsedDelay : 0;
    };

    const revealItems = document.querySelectorAll("[data-reveal]");

    const resetHiddenItems = () => {
      if (scrollDirection !== "up") {
        return;
      }

      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();

        if (rect.top >= window.innerHeight) {
          item.classList.remove("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (scrollDirection !== "down") {
              return;
            }

            const groupItems = getRevealGroup(entry.target);
            const groupDelays = groupItems.map(getDelayValue).sort((a, b) => a - b);
            const itemIndex = groupItems.indexOf(entry.target);
            const resolvedDelay = groupDelays[Math.max(itemIndex, 0)] ?? 0;

            entry.target.style.transitionDelay = `${resolvedDelay}ms`;
            entry.target.classList.add("is-visible");
            return;
          }

          if (scrollDirection === "up" && entry.boundingClientRect.top >= window.innerHeight) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    trackScrollDirection();
    const handleRevealScroll = () => {
      trackScrollDirection();
      resetHiddenItems();
    };

    window.addEventListener("scroll", handleRevealScroll, { passive: true });
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      window.removeEventListener("scroll", handleRevealScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isCalculatorModalOpen || isContactModalOpen || isPrivacyModalOpen || isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCalculatorModalOpen, isContactModalOpen, isPrivacyModalOpen, isMobileMenuOpen]);

  useEffect(() => {
    if (!isCalculatorModalOpen) {
      setIsCurrencyOpen(false);
    }
  }, [isCalculatorModalOpen]);

  useEffect(() => {
    if (!isContactModalOpen) {
      setIsContactChannelOpen(false);
    }
  }, [isContactModalOpen]);

  const submitLead = async (payload) => {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Не удалось отправить заявку.");
    }

    return result;
  };

  const handleCalculatorSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setCalculatorSubmitState({
      status: "submitting",
      message: "Отправляем расчет...",
    });

    try {
      await submitLead({
        type: "estimate",
        productCategory: formData.get("productCategory"),
        weight: formData.get("weight"),
        volume: formData.get("volume"),
        budget: formData.get("budget"),
        currency: formData.get("currency"),
        contactForEstimate: formData.get("contactForEstimate"),
        website: formData.get("website"),
      });

      form.reset();
      setCalculatorSubmitState({
        status: "success",
        message: "Заявка на расчет отправлена.",
      });
    } catch (error) {
      setCalculatorSubmitState({
        status: "error",
        message: error.message || "Не удалось отправить заявку.",
      });
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setContactSubmitState({
      status: "submitting",
      message: "Отправляем заявку...",
    });

    try {
      await submitLead({
        type: "contact",
        phone: formData.get("phone"),
        email: formData.get("email"),
        name: formData.get("name"),
        contactChannel: formData.get("contactChannel"),
        website: formData.get("website"),
      });

      form.reset();
      setSelectedContactChannel("");
      setContactSubmitState({
        status: "success",
        message: "Заявка отправлена.",
      });
    } catch (error) {
      setContactSubmitState({
        status: "error",
        message: error.message || "Не удалось отправить заявку.",
      });
    }
  };

  return (
    <div className="page-shell">
      <div className="mobile-header">
        <a className="mobile-header__brand" href="#top" aria-label="G-Way">
          <img className="mobile-header__logo" src="/logo.png" alt="G-Way" />
        </a>

        <button
          className={`mobile-header__menu-button ${isMobileMenuOpen ? "mobile-header__menu-button--open" : ""}`}
          type="button"
          aria-label="Открыть меню"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="mobile-menu" aria-modal="true" role="dialog" aria-label="Мобильное меню">
          <button className="mobile-menu__backdrop" type="button" aria-label="Закрыть меню" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="mobile-menu__panel">
            <button
              className="glass-button glass-button--primary mobile-menu__cta"
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsContactModalOpen(true);
              }}
            >
              <span>Оставить заявку</span>
            </button>

            <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
              {heroNav.map((item) => (
                <a
                  className="glass-button glass-button--accent mobile-menu__nav-button"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="mobile-menu__contacts">
              {sideContacts.map((item) => (
                <a className="mobile-menu__contact" href={item.href} key={item.label} aria-label={item.label}>
                  <HeaderIcon icon={item.icon} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <header className={`site-header ${isHeaderVisible ? "site-header--visible" : ""}`}>
        <div className="site-header__shell">
          <button className="glass-button glass-button--primary" type="button" onClick={() => setIsContactModalOpen(true)}>
            <span>Оставить заявку</span>
          </button>

          <nav className="site-header__nav" aria-label="Навигация по разделам">
            {heroNav.map((item) => (
              <a className="glass-button glass-button--accent glass-button--nav" href={item.href} key={item.label}>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <aside className="side-header" aria-label="Quick contacts">
        {sideContacts.map((item) => (
          <a className="side-header__button" href={item.href} key={item.label} aria-label={item.label}>
            <HeaderIcon icon={item.icon} />
          </a>
        ))}
      </aside>

      <section className="hero" aria-label="Первый экран" id="top" style={{ "--hero-fade-progress": heroFadeProgress }}>
        <div className="hero__media" />
        <div className="hero__overlay" />

        <div className="hero__content">
          <a className="hero__floating-logo" href="#top" aria-label="G-Way">
            <img className="hero__floating-logo-image" src="/logo.png" alt="G-Way" />
          </a>

          <div className="hero__actions">
            <p className="hero__tagline">Снижаем закупочную цену товара из Китая</p>

            <div className="hero__cta-stack">
              <p className="hero__subline">Прямые поставщики • Проверка • Полное сопровождение</p>

              <button className="glass-button glass-button--accent glass-button--hero-cta" type="button" onClick={() => setIsCalculatorModalOpen(true)}>
                <span>Рассчитать стоимость</span>
              </button>

              <p className="hero__microcopy">Бесплатный расчет</p>
            </div>
          </div>
        </div>
      </section>

      <main className="landing-main">
        <PainSection />
        <SolveSection />
        <TimelineSection />

        <section className="section" aria-labelledby="services-title" id="services">
          <div className="section__container">
            <div className="section-heading reveal-up" data-reveal>
              <p className="section-heading__eyebrow">Услуги</p>
              <h2 className="section-heading__title" id="services-title">
                Закрываем весь цикл закупки из Китая
              </h2>
            </div>

            <div className="services-grid">
              {services.map((service, index) => (
                <article className="glass-card service-card reveal-up" data-reveal style={{ transitionDelay: `${90 * index}ms` }} key={service.title}>
                  <span className="service-card__icon">{service.icon}</span>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__text">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ProcessRoadmap />
        <CaseResultSection />

        <section className="section" aria-labelledby="cases-title" id="cases">
          <div className="section__container">
            <div className="section-heading reveal-up" data-reveal>
              <p className="section-heading__eyebrow">Кейсы</p>
              <h2 className="section-heading__title" id="cases-title">
                Несколько результатов из реальной работы
              </h2>
            </div>

            <div className="cases-grid">
              {cases.map((item, index) => (
                <article className="glass-card case-card reveal-up" data-reveal style={{ transitionDelay: `${100 * index}ms` }} key={item.title}>
                  <h3 className="case-card__title">{item.title}</h3>
                  <strong className="case-card__result">{item.result}</strong>
                  <p className="case-card__text">{item.text}</p>
                  <p className="case-card__term">{item.term}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="cta-title" id="cta">
          <div className="section__container">
            <div className="glass-card cta-card reveal-up" data-reveal>
              <p className="section-heading__eyebrow">CTA</p>
              <h2 className="section-heading__title cta-card__title" id="cta-title">
                Если нужна поставка без хаоса, начнем с вашей задачи
              </h2>
              <p className="cta-card__text">
                Расскажите, что хотите закупать, а мы предложим понятный маршрут: поставщик, цена, контроль качества и доставка.
              </p>
              <button className="glass-button glass-button--accent" type="button" onClick={() => setIsContactModalOpen(true)}>
                <span>Оставить заявку</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {isCalculatorModalOpen ? (
        <div className="calculator-modal" aria-modal="true" role="dialog" aria-labelledby="calculator-request-title">
          <button className="calculator-modal__backdrop" type="button" aria-label="Закрыть окно" onClick={() => setIsCalculatorModalOpen(false)} />

          <div className="calculator-modal__card">
            <button className="calculator-modal__close" type="button" aria-label="Закрыть окно" onClick={() => setIsCalculatorModalOpen(false)}>
              ×
            </button>

            <h2 className="calculator-modal__title" id="calculator-request-title">
              Расскажите о товаре, и мы подготовим расчет
            </h2>

            <form className="calculator-form" onSubmit={handleCalculatorSubmit}>
              <input className="calculator-form__honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" />

              <label className="calculator-field">
                <span>Категория товара</span>
                <input type="text" name="productCategory" placeholder="Например, электроника" />
              </label>

              <label className="calculator-field">
                <span>Вес</span>
                <div className="calculator-field__with-unit">
                  <input type="text" name="weight" placeholder="Например, 120" />
                  <span className="calculator-field__unit">кг</span>
                </div>
              </label>

              <label className="calculator-field">
                <span>Объем</span>
                <div className="calculator-field__with-unit">
                  <input type="text" name="volume" placeholder="Например, 0.8" />
                  <span className="calculator-field__unit">м3</span>
                </div>
              </label>

              <label className="calculator-field">
                <span>Стоимость партии</span>
                <div className="calculator-field__compound">
                  <input type="text" name="budget" placeholder="Например, 3200" />
                  <div className={`calculator-select calculator-select--compact ${isCurrencyOpen ? "calculator-select--open" : ""}`}>
                    <input type="hidden" name="currency" value={selectedCurrency} />

                    <button
                      className="calculator-select__trigger calculator-select__trigger--compact"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isCurrencyOpen}
                      onClick={() => setIsCurrencyOpen((current) => !current)}
                    >
                      <span className="calculator-select__value calculator-select__value--filled">
                        {currencyOptions.find((item) => item.value === selectedCurrency)?.label ?? "USD"}
                      </span>
                      <span className="calculator-select__icon" aria-hidden="true">
                        <svg viewBox="0 0 20 20">
                          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    <div className="calculator-select__menu calculator-select__menu--compact" role="listbox" aria-label="Валюта">
                      {currencyOptions.map((item) => (
                        <button
                          className={`calculator-select__option ${selectedCurrency === item.value ? "calculator-select__option--selected" : ""}`}
                          key={item.value}
                          type="button"
                          role="option"
                          aria-selected={selectedCurrency === item.value}
                          onClick={() => {
                            setSelectedCurrency(item.value);
                            setIsCurrencyOpen(false);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </label>

              <label className="calculator-field calculator-field--full">
                <span>Отправить расчет на</span>
                <input type="text" name="contactForEstimate" placeholder="Телефон или почта" />
              </label>

              <div className="calculator-consent calculator-field--full">
                <label className="calculator-consent__label" htmlFor="estimate-privacy-consent">
                  <input id="estimate-privacy-consent" type="checkbox" name="privacyConsent" required />
                  <span>
                    Я соглашаюсь <span className="calculator-consent__inline-link" role="button" tabIndex={0} onClick={() => setIsPrivacyModalOpen(true)} onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsPrivacyModalOpen(true);
                      }
                    }}>
                      с политикой конфиденциальности и обработкой персональных данных
                    </span>
                    .
                  </span>
                </label>
              </div>

              <div className="calculator-form__actions calculator-field--full">
                <button className="glass-button glass-button--accent calculator-form__submit" type="submit" disabled={calculatorSubmitState.status === "submitting"}>
                  <span>{calculatorSubmitState.status === "submitting" ? "Отправляем..." : "Отправить расчет"}</span>
                </button>

                {calculatorSubmitState.message ? (
                  <p className={`calculator-form__status calculator-form__status--${calculatorSubmitState.status}`}>{calculatorSubmitState.message}</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isContactModalOpen ? (
        <div className="calculator-modal" aria-modal="true" role="dialog" aria-labelledby="calculator-title">
          <button className="calculator-modal__backdrop" type="button" aria-label="Закрыть окно" onClick={() => setIsContactModalOpen(false)} />

          <div className="calculator-modal__card">
            <button className="calculator-modal__close" type="button" aria-label="Закрыть окно" onClick={() => setIsContactModalOpen(false)}>
              ×
            </button>

            <h2 className="calculator-modal__title" id="calculator-title">
              Укажите свои контакты и мы с вами свяжемся
            </h2>

            <form className="calculator-form" onSubmit={handleContactSubmit}>
              <input className="calculator-form__honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" />

              <label className="calculator-field">
                <span>Телефон</span>
                <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" />
              </label>

              <label className="calculator-field">
                <span>Почта</span>
                <input type="email" name="email" placeholder="example@mail.com" />
              </label>

              <label className="calculator-field">
                <span>Имя</span>
                <input type="text" name="name" placeholder="Как к вам обращаться" />
              </label>

              <label className="calculator-field">
                <span>Предпочтительный канал связи</span>
                <div className={`calculator-select ${isContactChannelOpen ? "calculator-select--open" : ""}`}>
                  <input type="hidden" name="contactChannel" value={selectedContactChannel} />

                  <button
                    className="calculator-select__trigger"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isContactChannelOpen}
                    onClick={() => setIsContactChannelOpen((current) => !current)}
                  >
                    <span className={`calculator-select__value ${selectedContactChannel ? "calculator-select__value--filled" : ""}`}>
                      {contactChannels.find((item) => item.value === selectedContactChannel)?.label ?? "Выберите вариант"}
                    </span>
                    <span className="calculator-select__icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20">
                        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  <div className="calculator-select__menu" role="listbox" aria-label="Предпочтительный канал связи">
                    {contactChannels.map((item) => (
                      <button
                        className={`calculator-select__option ${selectedContactChannel === item.value ? "calculator-select__option--selected" : ""}`}
                        key={item.value}
                        type="button"
                        role="option"
                        aria-selected={selectedContactChannel === item.value}
                        onClick={() => {
                          setSelectedContactChannel(item.value);
                          setIsContactChannelOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </label>

              <div className="calculator-consent calculator-field--full">
                <label className="calculator-consent__label" htmlFor="contact-privacy-consent">
                  <input id="contact-privacy-consent" type="checkbox" name="privacyConsent" required />
                  <span>
                    Я соглашаюсь <span className="calculator-consent__inline-link" role="button" tabIndex={0} onClick={() => setIsPrivacyModalOpen(true)} onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsPrivacyModalOpen(true);
                      }
                    }}>
                      с политикой конфиденциальности и обработкой персональных данных
                    </span>
                    .
                  </span>
                </label>
              </div>

              <div className="calculator-form__actions calculator-field--full">
                <button className="glass-button glass-button--accent calculator-form__submit" type="submit" disabled={contactSubmitState.status === "submitting"}>
                  <span>{contactSubmitState.status === "submitting" ? "Отправляем..." : "Отправить заявку"}</span>
                </button>

                {contactSubmitState.message ? (
                  <p className={`calculator-form__status calculator-form__status--${contactSubmitState.status}`}>{contactSubmitState.message}</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isPrivacyModalOpen ? <PrivacyPolicyModal onClose={() => setIsPrivacyModalOpen(false)} /> : null}

      <footer className="footer">
        <div className="section__container footer__inner">
          <div className="footer__brand reveal-up" data-reveal>
            <img className="footer__logo-mark" src="/logo.png" alt="G-Way" />
            <p className="footer__note">Закупка, контроль качества и логистика из Китая.</p>
          </div>

          <div className="footer__contacts reveal-up" data-reveal style={{ transitionDelay: "120ms" }}>
            <a className="footer__contact-link" href="tel:+79040245342">
              +79040245342
            </a>
            <a className="footer__contact-link" href="https://t.me/maksgorozhankin" target="_blank" rel="noreferrer">
              Телеграм
            </a>
            <a className="footer__contact-link" href="https://vk.com/maknaggets_77" target="_blank" rel="noreferrer">
              Вконтакте
            </a>
            <span className="footer__contact-meta">График 24/7</span>
          </div>

          <div className="footer__bottom">
            <button className="footer__policy" type="button" onClick={() => setIsPrivacyModalOpen(true)}>
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
