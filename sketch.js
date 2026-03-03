let layers = [];
let images = {};

let controls = {};

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

  // Referências à UI HTML
  controls.transparency = document.getElementById("transparency");
  controls.rotation = document.getElementById("rotation");
  controls.spacing = document.getElementById("spacing");
  controls.size = document.getElementById("size");

  layers.push(new Layer(1));
  layers.push(new Layer(2));

  noLoop();

  // Atualiza sempre que um slider muda
  Object.values(controls).forEach(control => {
    control.addEventListener("input", () => redraw());
  });
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
  constructor(index) {
    this.images = [images[index]];
  }

  update() {
    this.rotationAngle = radians(controls.rotation.value);
    this.spacing = Number(controls.spacing.value);
    this.imageSize = Number(controls.size.value);
    this.transparency = Number(controls.transparency.value);
  }

  display() {
    const rows = Math.ceil(height / this.spacing);
    const cols = Math.ceil(width / this.spacing);

    const xOffset = (width - (cols - 1) * this.spacing) / 2;
    const yOffset = (height - (rows - 1) * this.spacing) / 2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        push();
        translate(x * this.spacing + xOffset, y * this.spacing + yOffset);
        rotate(this.rotationAngle);
        tint(255, this.transparency);
        imageMode(CENTER);
        image(this.images[0], 0, 0, this.imageSize, this.imageSize);
        pop();
      }
    }
  }
}
