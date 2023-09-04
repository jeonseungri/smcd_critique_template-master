class Fireworks {
  constructor(todaysData, thisWeekWinningNum) {
    this.x = eachDayX[(todayNth - 1) % 6];
    this.beginY = height - my[1]; // 왜 마진값을 올리면 시작하는 위치가 달라져야하는 것 아닌가? 왜 아무 변화가 없는 것인가?
    this.endY = this.beginY - (todaysData.luck / 100) * fireworksHMax;
    this.rad = (todaysData.sumHowManyMached / 6) * fireworksRadMax;
    this.todaysData = todaysData;
    this.thisWeekWinningNum = thisWeekWinningNum;
  }

  display() {
    // 출발지에서 도착지까지 선그리기
    line(this.x, this.beginY, this.x, this.endY);
    // 각 조별로
    this.todaysData.lottoSequences.forEach((eachLottoSequence) => {
      // 각 조의 각 숫자별로
      for (let idx = eachLottoSequence.length - 1; idx >= 0; idx--) {
        const angle = (TAU / 10) * eachLottoSequence[idx] - (TAU / 360) * 90;
        const dirVector = createVector(1, 0);
        dirVector.rotate(angle);
        dirVector.mult(this.rad);
        line(this.x, this.endY, this.x + dirVector.x, this.endY + dirVector.y);
      }
    });
  }
}
