# 🏆 Sport News — Website Template

A static front-end template for a sports news website (landing page). Built with plain **HTML + SCSS + Vanilla JS**, no frameworks — so it's easy to open and explore even if you don't have a frontend development background.

---

## 📖 What this is

This is the markup (layout) for the homepage of a sports news website: a header with navigation, a "Recent News" section, "Trending" stories, a club rankings block, articles, a blog section, a newsletter subscription block, and a footer. The design is responsive — it looks correct on both phones and desktops.

This project **has no backend** (no server, no database) — it's only the visual part (front-end), which can be connected to any CMS or API.

---

## 🗂️ Project structure

```
sport-web/
├── index.html          # the main (and only) page of the site
├── styles/              # stylesheets (SCSS)
│   ├── main.scss        # main styles entry point
│   ├── blocks/           # styles for individual blocks (header, news, articles...)
│   └── helpers/          # style helper tools
├── scripts/              # page logic (JS)
│   ├── main.js            # entry point
│   ├── mobile-navigation/ # mobile menu
│   ├── mono-slider/        # slider/carousel
│   └── optimize-images.js  # image compression script
├── images/               # site images
├── icons/                 # icons (SVG)
├── fonts/                  # site fonts
└── package.json            # list of development tools
```

---

## ⚙️ Technologies

| Used | Purpose |
|---|---|
| 🧱 **HTML5** | page markup (structure) |
| 🎨 **SCSS (Sass)** | convenient, structured styles organized by block (BEM methodology) |
| ⚡ **Vanilla JavaScript** | mobile menu, slider — without heavy libraries |
| 🖼️ **Sharp** | automatic image compression and conversion to modern formats (WebP, AVIF) |
| 👀 **Chokidar** | watches files for changes during development |

---

## 🚀 How to run the project locally

You'll need **[Node.js](https://nodejs.org/)** installed (for building styles and processing images).

### 1. Install dependencies

Run this in the project root in your terminal:

```bash
npm install
```

### 2. Build the styles

Styles are written in SCSS, but browsers only understand plain CSS — so they need to be "built" (compiled):

```bash
npm run sass-watch
```

This command watches the files in `styles/` and automatically rebuilds `styles/main.css` whenever you make a change.

### 3. Open the site

The simplest way is to open the `index.html` file directly in your browser (double-click the file), or use the **Live Server** extension in VS Code for a smoother development experience with automatic page reload.

---

## 🖼️ Image optimization

The project includes its own script that automatically compresses images and creates modern format versions (`.webp`, `.avif`) for them — this makes the site load faster.

Run a one-time optimization:

```bash
npm run images
```

Run in watch mode (automatically optimize new/changed images):

```bash
npm run images:watch
```

Processed images appear next to the originals in the `images/` folder.

---

## 📱 Responsiveness

The site displays correctly on:

- 🖥️ desktops
- 💻 tablets
- 📱 mobile phones

---

## 📝 License

ISC
