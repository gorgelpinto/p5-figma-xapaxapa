let layers = [];
let images = {};

/* =========================
   ESTADO EXTERNO
========================= */

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
  x3: defaultState(),
  l1: defaultState(),
  l2: defaultState(),
  l3: defaultState()
};

/* =========================
   PRELOAD
========================= */

function preload() {
  images[1] = loadImage("img1.png", () => {}, () => {});
  images[2] = loadImage("img2.png", () => {}, () => {});
  images[3] = loadImage("img3.png", () => {}, () => {});
}

/* =========================
   SETUP
========================= */

function setup() {
  const container = document.getElementById("sketch-container");

  createCanvas(
    container.offsetWidth,
    container.offsetHeight
  ).parent("sketch-container");

  // Criamos 3 layers mas só desenha se houver imagem
  layers.push(new Layer(1, "x1"));
  layers.push(new Layer(2, "x2"));
  layers.push(new Layer(3, "x3"));

  noLoop();
}

/* =========================
   DRAW
========================= */

function draw() {
  background(255);

  layers.forEach(layer => {
    layer.update();
    layer.display();
  });
}

/* =========================
   RESPONSIVO
========================= */

function windowResized() {
  const container = document.getElementById("sketch-container");

  resizeCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

  redraw();
}

/* =========================
   RECEBER DADOS DO FIGMA
========================= */

window.addEventListener("message", (event) => {

  const data = event.data;
  if (!data) return;

  console.log("Recebido:", data);

  if (data.type === "updateXapa" || data.type === "updateLayer") {

    const key = data.xapa || data.layer;

    if (!externalControls[key]) {
      console.log("Key desconhecida:", key);
      return;
    }

    externalControls[key] = {
      ...externalControls[key],
      ...data.values
    };

    redraw();
  }
});

/* =========================
   CLASSE
========================= */

class Layer {
  constructor(index, prefix) {
    this.image = images[index];
    this.prefix = prefix;
  }

  update() {
    const c =
      externalControls[this.prefix] ||
      externalControls["l" + this.prefix.slice(1)] ||
      defaultState();

    this.isActive = c.enabled;
    this.rotationAngle = radians(c.rotation);
    this.spacing = c.spacing;
    this.imageSize = c.size;
    this.transparency = c.transparency;
    this.horizontalOffset = c.x;
    this.verticalOffset = c.y;
  }

  display() {
    if (!this.isActive) return;
    if (!this.image) return;
    if (this.spacing <= 0) return;

    const buffer = this.spacing * 2;

    for (let x = -buffer; x < width + buffer; x += this.spacing) {
      for (let y = -buffer; y < height + buffer; y += this.spacing) {

        push();

        translate(
          x + this.horizontalOffset,
          y + this.verticalOffset
        );

        rotate(this.rotationAngle);
        tint(255, this.transparency);
        imageMode(CENTER);

        image(
          this.image,
          0,
          0,
          this.imageSize,
          this.imageSize
        );

        pop();
      }
    }
  }
}
