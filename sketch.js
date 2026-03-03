let layers = []; // Array to store layers
let bgColorInput; // Input field to control the background color
let bgColorLabel; // Label for the background color button
let images = {}; // Store preloaded images

function preload() {
  // Preload images
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

  textFont('Roboto Mono');

  const layerTitles = ["INFERIOR", "SUPERIOR"];

  for (let i = 0; i < 2; i++) {
    layers.push(new Layer(i + 1, 20, 10, layerTitles[i]));
  }

  noLoop();
}

function draw() {
  // Set background color based on input value
  if (bgColorInput) {
    background(bgColorInput.value());
  } else {
    background(255); // Default background if bgColorInput is not available
  }

  // Draw layers first
  layers.forEach(layer => {
    layer.update();
    layer.display();
  });

  // Draw UI controls last
  drawUIControls();
}

function drawUIControls() {
  // Placeholder function for drawing UI controls
  // You can customize this function to draw your UI controls
}

class Layer {
  constructor(index, uiX, uiY, title) {
    this.index = index;
    this.images = [images[index]]; // Use preloaded images

    // Base Y position for UI elements
    this.baseY = height; // Initialize with a large value

    switch (title) {
      case "SUPERIOR":
        this.baseY = uiY - 10; // Placing SUPERIOR UI controls above the INFERIOR
        break;
      case "INFERIOR":
        this.baseY = uiY + 20; // Placing INFERIOR UI controls below the sketch
        break;
    }

    // Create checkbox for visibility
    this.isVisible = true;
    this.visibilityCheckbox = createCheckbox("", this.isVisible);
    this.visibilityCheckbox.position(uiX, this.baseY + 13);
    this.visibilityCheckbox.changed(() => {
      this.isVisible = this.visibilityCheckbox.checked();
      redraw();
    });

    // Create layer title
    this.layerLabel = createP(title);
    this.layerLabel.position(uiX + 25, this.baseY - 5); // Adjusted position for title
    this.layerLabel.style('font-family', 'Roboto Mono');

    // Setup sliders and labels based on layer title
    this.setupSlidersAndLabels(uiX, this.baseY, title); // Adjusted position for sliders
  }

  setupSlidersAndLabels(uiX, baseY, title) {
    // Setup sliders and labels based on layer title
    let sliderContainer = createDiv('');
    sliderContainer.position(uiX + 130, baseY - 5);
    sliderContainer.style('display', 'flex');
    sliderContainer.style('flex-direction', 'row');
    sliderContainer.style('align-items', 'center');
    sliderContainer.style('font-family', 'Roboto Mono');

    // Add transparency slider for both layers
    this.transparencyLabel = createP("transparência");
    this.transparencyLabel.parent(sliderContainer);
    this.transparencySlider = createSlider(0, 255, 255);
    this.transparencySlider.parent(sliderContainer);
    this.transparencySlider.style('margin-right', '25px'); // Add margin to the right
    this.transparencySlider.input(() => redraw());

    // Common sliders for rotation, spacing, image size, horizontal position, and vertical position
    this.rotationAngleLabel = createP("rotação");
    this.rotationAngleLabel.parent(sliderContainer);
    this.rotationAngleSlider = createSlider(0, 360, 180);
    this.rotationAngleSlider.parent(sliderContainer);
    this.rotationAngleSlider.style('margin-right', '25px'); // Add margin to the right
    this.rotationAngleSlider.input(() => redraw());

    this.spacingLabel = createP("afastamento");
    this.spacingLabel.parent(sliderContainer);
    this.spacingSlider = createSlider(10, 1000, 50); // Increased maximum value to 1000
    this.spacingSlider.parent(sliderContainer);
    this.spacingSlider.style('margin-right', '25px'); // Add margin to the right
    this.spacingSlider.input(() => redraw());

    this.imageSizeLabel = createP("tamanho");
    this.imageSizeLabel.parent(sliderContainer);
    this.imageSizeSlider = createSlider(10, 1000, 100); // Increased maximum value to 1000
    this.imageSizeSlider.parent(sliderContainer);
    this.imageSizeSlider.style('margin-right', '25px'); // Add margin to the right
    this.imageSizeSlider.input(() => redraw());

    this.horizontalPositionLabel = createP("Horizontal");
    this.horizontalPositionLabel.parent(sliderContainer);
    this.horizontalPositionSlider = createSlider(-250, 250, 0); // Range from -200 to 200 with default 0
    this.horizontalPositionSlider.parent(sliderContainer);
    this.horizontalPositionSlider.style('margin-right', '25px');
    this.horizontalPositionSlider.input(() => redraw());

    this.verticalPositionLabel = createP("Vertical");
    this.verticalPositionLabel.parent(sliderContainer);
    this.verticalPositionSlider = createSlider(-250, 250, 0); // Range from -200 to 200 with default 0
    this.verticalPositionSlider.parent(sliderContainer);
    this.verticalPositionSlider.style('margin-right', '25px');
    this.verticalPositionSlider.input(() => redraw());

    // Add background color input and label for INFERIOR layer only
    if (title === "INFERIOR") {
      this.bgColorLabel = createP("cor de fundo");
      this.bgColorLabel.parent(sliderContainer);
      this.bgColorLabel.style('margin-right', '10px'); // Add margin to the right

      bgColorInput = createInput("#FFEB3B", "color");
      bgColorInput.parent(sliderContainer);
      bgColorInput.style('margin-right', '25px'); // Add margin to the right
      bgColorInput.input(() => redraw());
    }
  }

  update() {
    if (!this.isVisible) return; // Skip update if layer is not visible
    // Update rotation, spacing, image size, and transparency from sliders
    this.rotationAngle = radians(this.rotationAngleSlider.value());
    this.spacing = this.spacingSlider.value();
    this.imageSize = this.imageSizeSlider.value();
    this.horizontalOffset = this.horizontalPositionSlider.value();
    this.verticalOffset = this.verticalPositionSlider.value();
    this.transparency = this.transparencySlider.value();
  }

  display() {
    if (!this.isVisible) return; // Skip display if layer is not visible

    const rows = Math.ceil(height / this.spacing);
    const cols = Math.ceil(width / this.spacing);
    const xOffset = (width - (cols - 1) * this.spacing) / 2 + this.horizontalOffset;
    const yOffset = (height - (rows - 1) * this.spacing) / 2 + this.verticalOffset;

    // Cache values that do not change during the loop
    const rotationAngle = this.rotationAngle;
    const transparency = this.transparency;
    const imageSize = this.imageSize;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let imgIndex = (x + y) % this.images.length;
        push();
        translate(x * this.spacing + xOffset, y * this.spacing + yOffset);
        rotate(rotationAngle);
        tint(255, transparency); // Apply transparency
        imageMode(CENTER);
        image(this.images[imgIndex], 0, 0, imageSize, imageSize);
        pop();
      }
    }
  }
}

function windowResized() {
  const container = document.getElementById("sketch-container");
  resizeCanvas(
    container.offsetWidth,
    container.offsetHeight
  );
  redraw();
}
