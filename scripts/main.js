import MobileNavigation from "./mobile-navigation/index.js";
import MonoSlider from "./mono-slider/index.js";
import SmoothScroll from "./smooth-scroll/index.js";
import ScrollAnimations from "./scroll-animations/index.js";

new MobileNavigation();
new MonoSlider({ root: "[data-slider]", autoplay: false });

// GSAP + ScrollTrigger + SplitText + Lenis (~140K) керують лише плавним
// скролом і скрол-анімаціями нижче першого екрана — жоден з них не потрібен
// для першого рендеру hero-секції (вона тепер анімується чистим CSS, див.
// styles/blocks/hero/_hero.scss). Тому вантажимо їх лінивo, вже ПІСЛЯ
// повного завантаження сторінки, аби не тримати ці ~140K на критичному
// шляху рендеру та не впливати на LCP.
const VENDOR_SCRIPTS = [
  "./scripts/vendor/gsap.min.js",
  "./scripts/vendor/ScrollTrigger.min.js",
  "./scripts/vendor/SplitText.min.js",
  "./scripts/vendor/lenis.min.js",
];

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Не вдалось завантажити ${src}`));
    document.head.appendChild(script);
  });

const loadVendorScripts = async () => {
  try {
    // Послідовно: ScrollTrigger/SplitText очікують глобальний window.gsap.
    for (const src of VENDOR_SCRIPTS) {
      await loadScript(src);
    }
  } catch (error) {
    console.warn("main:", error.message);
    return;
  }

  new SmoothScroll().init();
  new ScrollAnimations().init();
};

if (document.readyState === "complete") {
  loadVendorScripts();
} else {
  window.addEventListener("load", loadVendorScripts, { once: true });
}
