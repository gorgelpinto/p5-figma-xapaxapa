let xapas = [];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

let externalControls = {
  x1: defaultXapaState(),
  x2: defaultXapaState(),
  x3: defaultXapaState()
};

function defaultXapaState() {
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

function setup() {
  const container = document.getElementById("sketch-container");

  const canvas = createCanvas(
    container.offsetWidth,
    container.offsetHeight
  );

  canvas.parent("sketch-container");

  xapas.push(new Xapa("x1"));
  xapas.push(new Xapa("x2"));
  xapas.push(new Xapa("x3"));

  // Upload listeners
  document.getElementById("upload-x1")
    .addEventListener("change", (e) => handleUpload(e, 0));

  document.getElementById("upload-x2")
    .addEventListener("change", (e) => handleUpload(e, 1));

  document.getElementById("upload-x3")
    .addEventListener("change", (e) => handleUpload(e, 2));

  noLoop();
}

function draw() {
  background(255);

  xapas.forEach(xapa => {
    xapa.update();
    xapa.display();
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

function handleUpload(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > MAX_FILE_SIZE) {
    alert(`Imagem demasiado grande (máx ${MAX_FILE_SIZE_MB} MB).`);
    event.target.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Ficheiro inválido.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    loadImage(e.target.result, img => {
      xapas[index].image = img;
      redraw();
    });
  };

  reader.readAsDataURL(file);
}

/* Comunicação externa (Figma) */
window.addEventListener("message", (event) => {
  const data = event.data;

  if (data.type === "updateXapa") {
    externalControls[data.xapa] = {
      ...externalControls[data.xapa],
      ...data.values
    };
    redraw();
  }
});

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

        translate(
          x + this.offsetX,
          y + this.offsetY
        );

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
