/**
 * Анімації елементів при скролі на GSAP ScrollTrigger.
 *
 * Це стартовий набір — заготовка під конкретні елементи, які ще потрібно
 * узгодити. Поки що тут один приклад: заголовки секцій "падають" зверху
 * та проявляються, коли доскролюєш до них (once: true — тільки один раз).
 *
 * Додавати нові анімації сюди зручно окремими методами на кшталт revealHeadings —
 * кожен метод відповідає за свою групу елементів.
 */
class ScrollAnimations {
  selectors = {
    sectionHeadings: [
      ".category__title",
      ".tranding-news__title",
      ".recent-news__title",
      ".ranking__title",
      ".blog__title",
    ].join(", "),
    heroTitle: ".hero__title-text",
    heroPlayer: ".hero__player",
    heroSubnewsItem: ".subnews__item",
    categoryItem: ".category__item",
    categoryList: ".category__list",
    trendingNewsItem: ".tranding-news__list .news-item",
    trendingNewsList: ".tranding-news__list",
    articlesPost: ".articles__post",
    articlesList: ".blog__articles",
    articlesBadge: ".articles__post-badge",
    heroSection: ".hero",
    heroBody: ".hero__body",
    subscriptionSection: ".subscription",
    subscriptionTitle: ".subscription__title",
    subscriptionImage: ".subscription__image",
  };

  init = () => {
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
      console.warn("ScrollAnimations: GSAP/ScrollTrigger не завантажені");
      return;
    }

    if (typeof window.SplitText !== "undefined") {
      window.gsap.registerPlugin(window.SplitText);
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    this.revealHeadings();
    this.revealHeroTitle();
    this.revealHeroPlayer();
    this.revealHeroSubnews();
    this.revealCategoryItems();
    this.revealTrendingNewsItems();
    this.revealArticles();
    this.revealHeroBallParallax();
    this.revealSubscription();
  };

  // Заголовок hero-секції: легка поява згори вниз, без ефекту "вильоту" —
  // невеликий зсув (20px) і трохи довша плавна анімація, оскільки заголовок
  // вже видно одразу при завантаженні сторінки (без ScrollTrigger)
  revealHeroTitle = () => {
    const title = document.querySelector(this.selectors.heroTitle);
    if (!title) return;

    window.gsap.from(title, {
      y: -20,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.1,
    });
  };

  // Гравець у hero: заходить збоку (справа) з фейдом, з невеликим
  // "перельотом" easing'ом (back.out) — наче щойно приземлився в кадр.
  // Стартує одразу після заголовка (без ScrollTrigger — блок і так на екрані).
  revealHeroPlayer = () => {
    const player = document.querySelector(this.selectors.heroPlayer);
    if (!player) return;

    window.gsap.from(player, {
      x: 80,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.3,
    });
  };

  // Картки "Today" (subnews) праворуч: піднімаються з фейдом одна за одною,
  // стартують трохи пізніше за гравця, щоб не заважати одне одному.
  revealHeroSubnews = () => {
    const items = document.querySelectorAll(this.selectors.heroSubnewsItem);
    if (!items.length) return;

    window.gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.15,
      delay: 0.6,
    });
  };

  // Category: стагер-поява знизу — кожна картка піднімається з фейдом
  // одна за одною (зліва направо) з невеликою затримкою між ними.
  revealCategoryItems = () => {
    const items = document.querySelectorAll(this.selectors.categoryItem);
    if (!items.length) return;

    window.gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: this.selectors.categoryList,
        start: "top 85%",
        once: true,
      },
    });
  };

  // Trending News: той самий стагер-ефект, що й для Category —
  // кожна картка новини піднімається з фейдом одна за одною зверху вниз.
  revealTrendingNewsItems = () => {
    const items = document.querySelectorAll(this.selectors.trendingNewsItem);
    if (!items.length) return;

    window.gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: this.selectors.trendingNewsList,
        start: "top 85%",
        once: true,
      },
    });
  };

  // Sports Article: той самий stagger-підйом карток, плюс бейдж
  // ("Basketball"/"Hockey"/"Badminton") виринає підскоком (scale 0 -> 1)
  // трохи згодом, коли картка вже майже "осіла" на місце.
  revealArticles = () => {
    const posts = document.querySelectorAll(this.selectors.articlesPost);
    const badges = document.querySelectorAll(this.selectors.articlesBadge);
    if (!posts.length) return;

    const scrollTrigger = {
      trigger: this.selectors.articlesList,
      start: "top 85%",
      once: true,
    };

    window.gsap.from(posts, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger,
    });

    if (badges.length) {
      window.gsap.from(badges, {
        scale: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.12,
        delay: 0.5,
        scrollTrigger,
      });
    }
  };

  // "Вау"-ефект №1: багатошаровий паралакс у hero-секції.
  // Коло (::before) прив'язане до CSS custom property --hero-ball-parallax,
  // яку тут плавно анімуємо під час скролу (scrub) — рухається вгору швидше.
  // Гравець (передній план) рухається трохи вниз і повільніше — за рахунок
  // різниці швидкостей між шарами й виникає відчуття глибини (depth parallax).
  revealHeroBallParallax = () => {
    const section = document.querySelector(this.selectors.heroSection);
    const body = document.querySelector(this.selectors.heroBody);
    const player = document.querySelector(this.selectors.heroPlayer);
    if (!section || !body) return;

    const scrollTrigger = {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    };

    window.gsap.fromTo(
      body,
      { "--hero-ball-parallax": "0px" },
      {
        "--hero-ball-parallax": "-140px",
        ease: "none",
        scrollTrigger,
      }
    );

    if (player) {
      window.gsap.fromTo(
        player,
        { y: 0 },
        {
          y: 60,
          ease: "none",
          scrollTrigger,
        }
      );
    }
  };

  // "Вау"-ефект №2: секція Subscription — заголовок розлітається по буквах
  // (SplitText) при вході в екран, а фото гравця отримує легкий паралакс
  // під час скролу через секцію.
  revealSubscription = () => {
    const section = document.querySelector(this.selectors.subscriptionSection);
    if (!section) return;

    const title = document.querySelector(this.selectors.subscriptionTitle);
    if (title && typeof window.SplitText !== "undefined") {
      const split = new window.SplitText(title, { type: "chars", charsClass: "subscription__char" });

      window.gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        rotateZ: 6,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.02,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });
    } else if (title) {
      window.gsap.from(title, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });
    }

    const image = document.querySelector(this.selectors.subscriptionImage);
    const canParallaxImage = window.matchMedia("(min-width: 1024px)").matches;
    if (image && canParallaxImage) {
      window.gsap.fromTo(
        image,
        { y: -12 },
        {
          y: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }
  };

  // Приклад: заголовок секції зʼявляється зверху вниз (translateY + fade-in)
  revealHeadings = () => {
    const headings = document.querySelectorAll(this.selectors.sectionHeadings);

    headings.forEach((heading) => {
      window.gsap.from(heading, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
      });
    });
  };
}

export default ScrollAnimations;
