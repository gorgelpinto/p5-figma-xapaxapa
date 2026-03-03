display() {
  if (!this.isActive) return;
  if (this.spacing <= 0) return;

  // Margem extra grande para evitar vazios
  const margin = this.spacing * 10;

  for (let x = -margin; x < width + margin; x += this.spacing) {
    for (let y = -margin; y < height + margin; y += this.spacing) {

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
