class MonoSlider {
  selectors = {
    track: "[data-slider-track]",
    prevButton: "[data-slider-prev]",
    nextButton: "[data-slider-next]",
  };

  constructor({
    root = "[data-slider]",
    autoplay = true,
    autoplayDelay = 5000,
  } = {}) {
    this.options = { autoplay, autoplayDelay };

    this.rootElement = document.querySelector(root);

    if (!this.rootElement) {
      console.warn(`MonoSlider: dismiss root element "${root}"`);
      return;
    }

    this.trackElement = this.rootElement.querySelector(this.selectors.track);
    this.prevButtonElement = this.rootElement.querySelector(
      this.selectors.prevButton,
    );
    this.nextButtonElement = this.rootElement.querySelector(
      this.selectors.nextButton,
    );
    this.slides = Array.from(this.trackElement.children);
    this.current = 0;
    this.autoPlayId = null;
    this.AUTOPLAY_DELEY = this.options.autoplayDelay;
    this.startX = 0;
    this.isDragging = false;
    this.initSlider(this.rootElement);

    this.bindEvents();
  }

  initSlider = (root) => {
    root.addEventListener("mouseenter", this.stopAutoPlay);
    root.addEventListener("mouseleave", this.startAutoPlay);
    this.update();

    if (this.options.autoplay) {
      this.startAutoPlay();
    }
  };

  update = () => {
    this.trackElement.style.transform = `translateX(-${this.current * 100}%)`;
  };

  gotTo = (index) => {
    this.current = (index + this.slides.length) % this.slides.length;
    this.update();
  };

  next = () => {
    this.gotTo(this.current + 1);
  };

  prev = () => {
    this.gotTo(this.current - 1);
  };

  startAutoPlay = () => {
    if (!this.options.autoplay) return;
    this.autoPlayId = setInterval(this.next, this.AUTOPLAY_DELEY);
  };

  stopAutoPlay = () => {
    clearInterval(this.autoPlayId);
  };

  restartAutoPlay = () => {
    this.stopAutoPlay();
    this.startAutoPlay();
  };

  bindEvents() {
    this.prevButtonElement.addEventListener("click", () => {
      this.prev();
      this.restartAutoPlay();
    });
    this.nextButtonElement.addEventListener("click", () => {
      this.next();
      this.restartAutoPlay();
    });
    this.trackElement.addEventListener("pointerdown", (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
    });
    this.trackElement.addEventListener("pointerup", (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const deltaX = e.clientX - this.startX;
      const SWIPE_TRASHOLD = 40;

      if (deltaX > SWIPE_TRASHOLD) {
        this.prev();
      } else if (deltaX < -SWIPE_TRASHOLD) {
        this.next();
      }
      this.restartAutoPlay();
    });
  }
}

export default MonoSlider;
