class TrimLine {
  constructor(x, y, rad, [red, green, blue]) {
    this.pos = createVector(x, y);
    this.originPos = createVector(this.pos.x, this.pos.y);
    this.tarPos = createVector(this.pos.x, this.pos.y);
    this.beginTime = 0;
    this.duration = 1000;
    this.col = { r: red, g: green, b: blue };
    this.rad = rad;
    this.chain = [];
    for (let cnt = 0; cnt < 10; cnt++) {
      //파티클 터지는 그  순간
      this.chain.push(createVector(this.pos.x, this.pos.y));
    }
  }

  setTarPos(x, y) {
    this.originPos.set(this.pos);
    this.tarPos.set(x, y);
    this.beginTime = millis();
  }

  getNormalizedTime() {
    return constrain((millis() - this.beginTime) / this.duration, 0, 1);
  }

  isDead() {
    return (
      this.getNormalizedTime() >= 1 &&
      this.chain[this.chain.length - 1].x === this.pos.x &&
      this.chain[this.chain.length - 1].y === this.pos.y &&
      this.chain[this.chain.length - 1].x === this.chain[0].x &&
      this.chain[this.chain.length - 1].y === this.chain[0].y
    );
  }

  easing(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  update() {
    this.updateChain();
    const dist = this.tarPos.copy();
    dist.sub(this.originPos);
    dist.mult(this.easing(this.getNormalizedTime()));
    dist.add(this.originPos);
    this.pos.set(dist);
  }

  display() {
    noFill();
    stroke(this.col.r, this.col.g, this.col.b);
    strokeWeight(1);
    strokeJoin(ROUND);
    strokeCap(ROUND);
    beginShape();
    this.chain.forEach((eachChain) => {
      vertex(eachChain.x, eachChain.y);
    });
    endShape();
    noStroke();
    fill(this.col.r, this.col.g, this.col.b);
    circle(this.pos.x, this.pos.y, 2 * this.rad);
  }

  updateChain() {
    this.chain[0].set(this.pos);
    for (let idx = this.chain.length - 1; idx > 0; idx--) {
      this.chain[idx].set(this.chain[idx - 1]);
    }
  }
}
