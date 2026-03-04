let layers = [];
let baseImages = {};

function defaultState() {
  return {
    enabled: true,
    rotation: 180,
    spacing: 80,
    size: 120,
    transparency: 255,
    x: 0,
    y: 0
  };
}

let externalControls = {
  x1: defaultState(),
  x2: defaultState(),
  x3: defaultState()
};

/* ---------- PRELOAD ---------- */

function preload() {

  baseImages.x1 = loadImage("img1.png");
  baseImages.x2 = loadImage("img2.png");
  baseImages.x3 = loadImage("img3.png");

}

/* ---------- SETUP ---------- */

function setup() {

  const container = document.getElementById("sketch-container");

  createCanvas(
    container.offsetWidth,
    container.offsetHeight
  ).parent("sketch-container");

  layers.push(new Xapa("x1", baseImages.x1));
  layers.push(new Xapa("x2", baseImages.x2));
  layers.push(new Xapa("x3", baseImages.x3));

}

/* ---------- DRAW ---------- */

function draw() {

  background(255);

  layers.forEach(layer => {
    layer.update();
    layer.display();
  });

}

/* ---------- RESIZE ---------- */

function windowResized() {

  const container = document.getElementById("sketch-container");

  resizeCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

}

/* ---------- MESSAGES ---------- */

window.addEventListener("message", (event) => {

  const data = event.data;
  if (!data) return;

  /* sliders */

  if (data.type === "updateXapa") {

    externalControls[data.xapa] = {
      ...externalControls[data.xapa],
      ...data.values
    };

  }

  /* upload imagem */

  if (data.type === "uploadImage") {

    const layer = layers.find(l => l.prefix === data.xapa);
    if (!layer) return;

    loadImage(data.imageData, img => {
      layer.image = img;
    });

  }

  /* ordem */

  if (data.type === "setOrder") {

    const order = data.order;

    layers.sort((a, b) => {
      return order.indexOf(a.prefix) - order.indexOf(b.prefix);
    });

  }

  /* EXPORT PNG */

  if (data.type === "exportPNG") {

    const exportSize = data.size || 4000;

    const exportCanvas = createGraphics(exportSize, exportSize);

    exportCanvas.background(255);

    const scale = exportSize / width;

    layers.forEach(layer => {

      const c = externalControls[layer.prefix];

      if (!c.enabled || !layer.image) return;

      const spacing = c.spacing * scale;
      const size = c.size * scale;

      const offsetX = c.x * scale;
      const offsetY = c.y * scale;

      const rotation = radians(c.rotation);

      const buffer = spacing * 2;

      for (let x = -buffer; x < exportSize + buffer; x += spacing) {
        for (let y = -buffer; y < exportSize + buffer; y += spacing) {

          exportCanvas.push();

          exportCanvas.translate(
            x + offsetX,
            y + offsetY
          );

          exportCanvas.rotate(rotation);

          exportCanvas.tint(255, c.transparency);

          exportCanvas.imageMode(CENTER);

          exportCanvas.image(
            layer.image,
            0,
            0,
            size,
            size
          );

          exportCanvas.pop();

        }
      }

    });

    const link = document.createElement("a");

    link.download = "xapa-composition.png";
    link.href = exportCanvas.canvas.toDataURL("image/png");

    link.click();

  }

});

/* ---------- CLASSE ---------- */

class Xapa {

  constructor(prefix, image) {
    this.prefix = prefix;
    this.image = image;
  }

  update() {

    const c = externalControls[this.prefix];

    this.enabled = c.enabled;
    this.rotation = radians(c.rotation);
    this.spacing = c.spacing;
    this.size = c.size;
    this.transparency = c.transparency;
    this.offsetX = c.x;
    this.offsetY = c.y;

  }

  display() {

    if (!this.enabled) return;
    if (!this.image) return;

    const buffer = this.spacing * 2;

    for (let x = -buffer; x < width + buffer; x += this.spacing) {
      for (let y = -buffer; y < height + buffer; y += this.spacing) {

        push();

        translate(x + this.offsetX, y + this.offsetY);

        rotate(this.rotation);

        tint(255, this.transparency);

        imageMode(CENTER);

        image(
          this.image,
          0,
          0,
          this.size,
          this.size
        );

        pop();

      }
    }

  }

}
