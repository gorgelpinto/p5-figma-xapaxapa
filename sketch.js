let layers = [];
let images = {};

function preload() {
  images[1] = loadImage("img1.png");
  images[2] = loadImage("img2.png");
}

function setup() {
  const container = document.getElementById("sketch-container");

  const canvas = createCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

  canvas.parent("sketch-container");

  layers.push(new Layer(1, "l1"));
  layers.push(new Layer(2, "l2"));

  noLoop();
}

function draw() {
  background(255);

  layers.forEach(layer => {
    layer.update();
    layer.display();
  });
}

function windowResized() {
  const container = document.getElementById("sketch-container");

  resizeCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

  redraw();
}

class Layer {
  constructor(index, prefix) {
    this.image = images[index];

    this.enabled = document.getElementById(prefix + "-enabled");

    this.controls = {
      transparency: document.getElementById(prefix + "-transparency"),
      rotation: document.getElementById(prefix + "-rotation"),
      spacing: document.getElementById(prefix + "-spacing"),
      size: document.getElementById(prefix + "-size"),
      x: document.getElementById(prefix + "-x"),
      y: document.getElementById(prefix + "-y"),
    };

    this.enabled.addEventListener("change", () => redraw());

    Object.values(this.controls).forEach(control => {
      control.addEventListener("input", () => redraw());
    });
  }

  update() {
    this.isActive = this.enabled.checked;

    this.rotationAngle = radians(Number(this.controls.rotation.value));
    this.spacing = Number(this.controls.spacing.value);
    this.imageSize = Number(this.controls.size.value);
    this.transparency = Number(this.controls.transparency.value);
    this.horizontalOffset = Number(this.controls.x.value);
    this.verticalOffset = Number(this.controls.y.value);
  }

  display() {
    if (!this.isActive) return;
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
