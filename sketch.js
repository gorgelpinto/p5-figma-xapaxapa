let layers = [];

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
  x3: defaultState()
};

/* =========================
   SETUP
========================= */

function setup() {
  const container = document.getElementById("sketch-container");

  createCanvas(
    container.offsetWidth,
    container.offsetHeight
  ).parent("sketch-container");

  layers.push(new Xapa("x1"));
  layers.push(new Xapa("x2"));
  layers.push(new Xapa("x3"));

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
   RECEBER MENSAGENS DO FIGMA
========================= */

window.addEventListener("message", (event) => {

  const data = event.data;
  if (!data) return;

  if (data.type === "updateXapa") {

    externalControls[data.xapa] = {
      ...externalControls[data.xapa],
      ...data.values
    };

    redraw();
  }

  if (data.type === "uploadImage") {

    loadImage(data.imageData, (img) => {

      const layer = layers.find(l => l.prefix === data.xapa);

      if (layer) {
        layer.image = img;
        redraw();
      }

    });
  }
});

/* =========================
   CLASSE XAPA
========================= */

class Xapa {
  constructor(prefix) {
    this.prefix = prefix;
    this.image = null;
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
        image(this.image, 0, 0, this.size, this.size);
        pop();

      }
    }
  }
}
