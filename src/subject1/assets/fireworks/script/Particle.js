class Particle {
  constructor(
    { x: x, y: y }, // 파티클의 초기 '위치'를 지정하는 개체
    { x: velX, y: velY }, // 파티클의 초기 '속도'를 지정하는 개체
    mass, // 질량
    lifespan, //수명
    rad, //파티클 반지름
    [red, green, blue]
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(velX, velY);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.lifespan = lifespan;
    this.life = millis();
    this.col = { r: red, g: green, b: blue };
    this.rad = rad;
  }

  applyGravity(gravity) {
    this.acc.add(gravity);
  }

  applyForce(force) {
    this.acc.add(p5.Vector.div(force, this.mass));
  }

  applyFriction(c) {
    this.vel.mult(1 - c);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  isDead() {
    return this.getNormalizedLife() > 1;
  }

  getNormalizedLife() {
    return (millis() - this.life) / this.lifespan;
  }

  display() {
    noFill();
    stroke(
      this.col.r,
      this.col.g,
      this.col.b,
      255 * (1 - this.getNormalizedLife())
    );
    strokeWeight(1);
    strokeJoin(ROUND);
    strokeCap(ROUND);

    noStroke();
    fill(
      this.col.r,
      this.col.g,
      this.col.b,
      255 * (1 - this.getNormalizedLife())
    );
    circle(this.pos.x, this.pos.y, 2 * this.rad);
  }
}
