const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class ImageOptimizer {
  sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);

  constructor({
    imagesDir = path.resolve(__dirname, "..", "images"),
    webpOptions = { quality: 82, effort: 6 },
    avifOptions = { quality: 58 },
  } = {}) {
    this.imagesDir = imagesDir;
    this.webpOptions = webpOptions;
    this.avifOptions = avifOptions;
  }

  isSourceImage = (filePath) => {
    return this.sourceExtensions.has(path.extname(filePath).toLowerCase());
  };

  formatKB = (bytes) => {
    return (bytes / 1024).toFixed(1) + "K";
  };

  walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.walk(fullPath));
      } else if (this.isSourceImage(entry.name)) {
        files.push(fullPath);
      }
    }
    return files;
  };

  isUpToDate = (sourcePath, outputPath) => {
    if (!fs.existsSync(outputPath)) return false;
    const sourceMTime = fs.statSync(sourcePath).mtimeMs;
    const outputMTime = fs.statSync(outputPath).mtimeMs;
    return outputMTime >= sourceMTime;
  };

  convertOne = async (sourcePath) => {
    const dir = path.dirname(sourcePath);
    const base = path.basename(sourcePath, path.extname(sourcePath));
    const webpPath = path.join(dir, base + ".webp");
    const avifPath = path.join(dir, base + ".avif");

    const relSource = path.relative(process.cwd(), sourcePath);
    const sourceSize = fs.statSync(sourcePath).size;
    let didSomething = false;

    if (!this.isUpToDate(sourcePath, webpPath)) {
      await sharp(sourcePath).webp(this.webpOptions).toFile(webpPath);
      const outSize = fs.statSync(webpPath).size;
      console.log(
        `  webp  ${relSource} (${this.formatKB(sourceSize)} -> ${this.formatKB(outSize)})`,
      );
      didSomething = true;
    }

    if (!this.isUpToDate(sourcePath, avifPath)) {
      await sharp(sourcePath).avif(this.avifOptions).toFile(avifPath);
      const outSize = fs.statSync(avifPath).size;
      console.log(
        `  avif  ${relSource} (${this.formatKB(sourceSize)} -> ${this.formatKB(outSize)})`,
      );
      didSomething = true;
    }

    return didSomething;
  };

  convertAll = async () => {
    if (!fs.existsSync(this.imagesDir)) {
      console.warn(`optimize-images: папку не знайдено: ${this.imagesDir}`);
      return;
    }

    const files = this.walk(this.imagesDir);
    console.log(`optimize-images: знайдено ${files.length} jpg/png файлів`);

    let converted = 0;
    for (const file of files) {
      try {
        const changed = await this.convertOne(file);
        if (changed) converted += 1;
      } catch (error) {
        console.error(`optimize-images: помилка для ${file}:`, error.message);
      }
    }

    if (converted === 0) {
      console.log("optimize-images: усе вже актуально, конвертувати нічого");
    } else {
      console.log(`optimize-images: готово, оновлено файлів: ${converted}`);
    }

    return converted;
  };

  handleFsEvent = (filePath) => {
    if (!this.isSourceImage(filePath)) return;
    this.convertOne(filePath).catch((error) => {
      console.error(`optimize-images: помилка для ${filePath}:`, error.message);
    });
  };

  watch = () => {
    console.log(
      `optimize-images: слідкую за змінами в ${this.imagesDir} (Ctrl+C — вихід)`,
    );

    this.convertAll();

    let chokidar;
    try {
      chokidar = require("chokidar");
    } catch (error) {
      console.error(
        "optimize-images: для --watch потрібен пакет chokidar. Встанови його: npm install",
      );
      process.exit(1);
    }

    const watcher = chokidar.watch(this.imagesDir, {
      ignoreInitial: true,
      ignored: (filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        return ext !== "" && !this.sourceExtensions.has(ext);
      },
    });

    watcher.on("add", this.handleFsEvent);
    watcher.on("change", this.handleFsEvent);

    return watcher;
  };

  run = ({ watch = false } = {}) => {
    if (watch) {
      this.watch();
    } else {
      this.convertAll();
    }
  };
}

const args = process.argv.slice(2);
const optimizer = new ImageOptimizer();
optimizer.run({ watch: args.includes("--watch") });

module.exports = ImageOptimizer;
