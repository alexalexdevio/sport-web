/**
 * Плавна прокрутка сторінки на Lenis + синхронізація з GSAP ScrollTrigger.
 *
 * Важливо: Lenis тут працює у ЗВИЧАЙНОМУ режимі (без wrapper/content) —
 * тобто без обгортання сторінки у додатковий div і без transform на контенті.
 * Він плавно анімує реальний скрол window через requestAnimationFrame.
 * Завдяки цьому header з position: sticky продовжує працювати як і раніше —
 * жодних додаткових правок у розмітці чи CSS не знадобилось.
 */
class SmoothScroll {
  constructor({
    lenisOptions = {
      duration: 1.2,
      smoothWheel: true,
      anchors: true,
    },
  } = {}) {
    this.lenisOptions = lenisOptions;
    this.lenis = null;
  }

  handleTick = (time) => {
    this.lenis.raf(time * 1000);
  };

  init = () => {
    if (typeof window.Lenis !== "function") {
      console.warn("SmoothScroll: бібліотека Lenis не завантажена");
      return null;
    }

    this.lenis = new window.Lenis(this.lenisOptions);

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      this.lenis.on("scroll", window.ScrollTrigger.update);

      window.gsap.ticker.add(this.handleTick);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(this.rafFallback);
    }

    return this.lenis;
  };

  rafFallback = (time) => {
    this.lenis.raf(time);
    requestAnimationFrame(this.rafFallback);
  };
}

export default SmoothScroll;
