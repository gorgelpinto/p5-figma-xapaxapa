let layers = [];
let images = {};

function preload() {
  images[1] = loadImage('img1.png');
  images[2] = loadImage('img2.png');
}

function setup() {
  const container = document.getElementById("sketch-container");

  const canvas = createCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

  canvas.parent("sketch-container");

  // Criar layers independentes
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
    this.images = [images[index]];

    this.controls = {
      transparency: document.getElementById(prefix + "-transparency"),
      rotation: document.getElementById(prefix + "-rotation"),
      spacing: document.getElementById(prefix + "-spacing"),
      size: document.getElementById(prefix + "-size"),
      x: document.getElementById(prefix + "-x"),
      y: document.getElementById(prefix + "-y"),
    };

    // Redesenha sempre que qualquer slider muda
    Object.values(this.controls).forEach(control => {
      control.addEventListener("input", () => redraw());
    });
  }

  update() {
    this.rotationAngle = radians(Number(this.controls.rotation.value));
    this.spacing = Number(this.controls.spacing.value);
    this.imageSize = Number(this.controls.size.value);
    this.transparency = Number(this.controls.transparency.value);
    this.horizontalOffset = Number(this.controls.x.value);
    this.verticalOffset = Number(this.controls.y.value);
  }

  display() {
    if (this.spacing <= 0) return;

    const rows = Math.ceil(height / this.spacing);
    const cols = Math.ceil(width / this.spacing);

    const xOffset =
      (width - (cols - 1) * this.spacing) / 2 + this.horizontalOffset;

    const yOffset =
      (height - (rows - 1) * this.spacing) / 2 + this.verticalOffset;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        push();
        translate(
          x * this.spacing + xOffset,
          y * this.spacing + yOffset
        );
        rotate(this.rotationAngle);
        tint(255, this.transparency);
        imageMode(CENTER);
        image(
          this.images[0],
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
