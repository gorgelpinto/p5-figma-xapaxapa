display() {
  if (!this.isActive) return;
  if (this.spacing <= 0) return;

  // Offset modular (ancora a grelha)
  const offsetX = this.horizontalOffset % this.spacing;
  const offsetY = this.verticalOffset % this.spacing;

  // Começa antes do canvas para garantir cobertura
  for (let x = -this.spacing; x < width + this.spacing; x += this.spacing) {
    for (let y = -this.spacing; y < height + this.spacing; y += this.spacing) {

      push();

      translate(
        x + offsetX,
        y + offsetY
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
