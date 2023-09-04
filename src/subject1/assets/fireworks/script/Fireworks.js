class Fireworks {
  constructor(todaysData, thisWeekWinningNum) {
    this.todaysData = todaysData;
    this.thisWeekWinningNum = thisWeekWinningNum;
    this.initX = eachDayX[(todayNth - 1) % 6]; //0부터 시작하니까 -1를 해서 1부터 시작하도록, 한없이 커지니까 6을 나누자
    this.initY = height - 60; // 시작 위치
    this.explosionParticles = [];
    this.explosionX = this.initX;
    this.explosionY = this.initY - (todaysData.luck / 100) * fireworksHMax;
    this.explosionParticleMass = 1; //터진후 자글자글, 파티클 질량
    this.explosionParticleRad = 2; // 파티클 원 모양 크기
    this.trimLine = new TrimLine( // 객체 생성 라인 초기화 폭발 위치로 설정
      this.initX,
      this.initY,
      this.explosionParticleRad,
      [255, 255, 255] //피어오르는 컬러
    );
    this.isExplode = false;
    this.trimLine.setTarPos(this.explosionX, this.explosionY);
    this.isDead = false;
  }

  explode = () => {
    // 각 조별로
    this.todaysData.lottoSequences.forEach(
      (eachLottoSequence, eachGroupIdx) => {
        // 이번조가 몇개나 맞았는지 가져오기
        const howManyMached = this.todaysData.howManyMached[eachGroupIdx];
        // 계산 편의를 위한 0부터 증가하는 인덱스
        let idx = 0;
        // 각 조의 각 숫자별로
        for (
          let eachNumberIdx = eachLottoSequence.length - 1;
          eachNumberIdx >= 0;
          eachNumberIdx--
        ) {
          // 각 숫자를 각도로 변환
          const angle =
            (TAU / 10) * eachLottoSequence[eachNumberIdx] - (TAU / 360) * 90;
          // 각 숫자를 속도로 변환
          const speed =
            fireworksVelMin +
            (howManyMached / 6) * (fireworksVelMax - fireworksVelMin);
          // 1짜리 각도 0인 벡터 생성
          const vel = createVector(1, 0);
          // 벡터를 회전
          vel.rotate(angle);
          // 벡터를 원하는 속도로 곱셈
          vel.mult(speed);

          // 기본 흰색으로 만들고
          const col = [255, 0, 255]; //당첨된 친구
          // 어차피 순서대로 계속 맞는지를 체크하니까,
          // 아직 맞은 갯수의 범위에 있으면 그대로 냅두고, 벗어났으면 색을 변경
          // 예제에서는 그냥 빨강으로 변경
          if (idx >= howManyMached) {
            col[0] = 255;
            col[1] = 255;
            col[2] = 255;
          }

          // 파티클 추가 - 이게 하나의 숫자에 대한 수행.
          this.explosionParticles.push(
            new Particle(
              { x: this.explosionX, y: this.explosionY }, //파티클의 초기위치
              vel,
              this.explosionParticleMass,
              // ms단위로 몇초 간 유지되냐를 랜덤으로 넣어줌
              random(2500, 5000),
              this.explosionParticleRad,
              col
            )
          );
          idx++;
        }
      }
    );
  };

  update(gravity, windMag, frictionC) {
    if (!this.trimLine.isDead()) {
      this.trimLine.update();
    } else {
      if (!this.isExplode) {
        this.explode();
        this.isExplode = true;
      }
      this.updateParticles(gravity, windMag, frictionC);
    }
  }

  updateParticles = (gravity, windMag, frictionC) => {
    for (let idx = this.explosionParticles.length - 1; idx >= 0; idx--) {
      const wind = p5.Vector.random2D();
      wind.mult(windMag);
      this.explosionParticles[idx].applyGravity(gravity);
      this.explosionParticles[idx].applyForce(wind);
      this.explosionParticles[idx].applyFriction(frictionC);
      this.explosionParticles[idx].update();
      if (this.explosionParticles[idx].isDead())
        this.explosionParticles.splice(idx, 1);
    }
    if (this.explosionParticles.length === 0) {
      this.isDead = true;
    }
  };

  display() {
    if (!this.isExplode) {
      this.trimLine.display();
    } else {
      this.displayParticles(); //타임라인을 그리고 파티클을 그린다.
    }
  }

  displayParticles = () => {
    this.explosionParticles.forEach((eachParticle) => {
      eachParticle.display();
    });
  };
}
