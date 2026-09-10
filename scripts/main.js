import MobileNavigation from "./mobile-navigation/index.js";
import MonoSlider from "./mono-slider/index.js";
import SmoothScroll from "./smooth-scroll/index.js";
import ScrollAnimations from "./scroll-animations/index.js";

new MobileNavigation();
new MonoSlider({ root: "[data-slider]", autoplay: false });

new SmoothScroll().init();
new ScrollAnimations().init();
