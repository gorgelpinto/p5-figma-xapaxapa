// ===============================
// CONFIGURAÇÃO GLOBAL
// ===============================

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

let xapas = [];

// Estado externo (compatível com Figma postMessage)
let externalControls = {
  x1: createDefaultState(),
  x2: createDefaultState(),
  x3: createDefaultState()
};

function createDefaultState() {
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

// ===============================
// P5 SETUP
// ===============================

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();

  xapas.push(new Xapa("x1"));
  xapas.push(new Xapa("x2"));
  xapas.push(new Xapa("x3"));

  // Upload handlers
  document.getElementById("upload-x1")
    .addEventListener("change", (e) => handleUpload(e, 0));

  document.getElementById("upload-x2")
    .addEventListener("change", (e) => handleUpload(e, 1));

  document.getElementById("upload-x3")
    .addEventListener("change", (e) => handleUpload(e, 2));
}

function draw() {
  background(255);

  xapas.forEach(x => {
    x.update();
    x.display();
  });
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  redraw();
}

// ===============================
// UPLOAD
// ===============================

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

// ===============================
// COMUNICAÇÃO COM FIGMA
// ===============================

window.addEventListener("message", (event) => {
  const data = event.data;

  if (data?.type === "updateXapa") {
    externalControls[data.xapa] = {
      ...externalControls[data.xapa],
      ...data.values
    };
    redraw();
  }
});

// ===============================
// CLASSE XAPA
// ===============================

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
