class MobileNavigation {
  selectors = {
    root: "[data-js-header]",
    overlay: "[data-js-header-overlay]",
    navButton: "[data-js-mobile-button]",
  };

  stateClasses = {
    isActive: "is-active",
    isLock: "is-lock",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay,
    );
    this.navButtonElement = this.rootElement.querySelector(
      this.selectors.navButton,
    );

    this.bindEvenets();
  }

  onNavButtonHandler = () => {
    this.navButtonElement.classList.toggle(this.stateClasses.isActive);
    this.overlayElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };

  bindEvenets() {
    this.navButtonElement.addEventListener("click", this.onNavButtonHandler);
  }
}

export default MobileNavigation;
