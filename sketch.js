display() {
  if (!this.isActive) return;
  if (this.spacing <= 0) return;

  // Encontrar ponto inicial alinhado à grelha
  let startX = -((this.horizontalOffset % this.spacing) + this.spacing);
  let startY = -((this.verticalOffset % this.spacing) + this.spacing);

  for (let x = startX; x < width + this.spacing; x += this.spacing) {
    for (let y = startY; y < height + this.spacing; y += this.spacing) {

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
