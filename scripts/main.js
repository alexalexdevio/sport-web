import MobileNavigation from "./mobile-navigation/index.js";
import MonoSlider from "./mono-slider/index.js";

new MobileNavigation();
new MonoSlider({ root: "[data-slider]", autoplay: false });
