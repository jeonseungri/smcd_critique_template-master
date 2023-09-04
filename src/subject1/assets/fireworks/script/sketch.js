const fireworks = [];

let img;
function preload() {
  img = loadImage('Lottologo.png');
}

let timeSpeed = 1;
let timeInFrame = 0;
const eachDayInTime = 120; // 몇이 증가하면 하루가 지난다? 1초 = 60
let todayNth = 0; //오늘 번호
let lastDayNth = 0; //지난번호
let weekNth = 0; //이번주
// let lottoTime = [
//   '155th',
//   '156th',
//   '157th',
//   '158th',
//   '159th',
//   '160th',
//   '161st',
//   '162nd',
// ];
// let word;
// 좌우 마진
const mx = [80, 80]; // mx[0], mx[1]
// 각 요일별 폭죽 x좌표
const eachDayX = [0, 0, 0, 0, 0, 0];
// 상하 마진
const my = [200, 200];
// 폭죽 솟는 최대 높이
const fireworksHMax = 610;
// 폭죽의 최소 속도
const fireworksVelMin = 50;
// 폭죽의 최대 속도
const fireworksVelMax = 300;
let gravity;
const windMag = 0.1; //잔상
const frictionC = 0.5; //크기

let pg;

function setup() {
  setSketchContainer(3 / 1.8, 'canvas');

  const timeSlider = document.getElementById('timeSpeed');
  timeSlider.addEventListener('input', (evt) => {
    // console.log(evt.target.value);
    timeSpeed = Number(evt.target.value);
  });
  // 좌우 마진 반영해 각 요일별 폭죽 x좌표 등분
  for (let idx = 0; idx < 6; idx++) {
    eachDayX[idx] = ((width - mx[0] - mx[1]) / 7) * (idx + 1) + mx[0];
  }

  gravity = createVector(0, 0.5);
  console.log(eachDayX);

  background(255);

  pg = createGraphics(width, height);
}

const timer = (adder) => {
  // 타이머 오름
  timeInFrame += adder;
  // 시간을 기준으로 몇번째 날인지 계산
  const calcedTodayNth = parseInt(timeInFrame / eachDayInTime);
  // 이전 날짜랑 비교해서 날짜 달라졌다면
  if (calcedTodayNth !== lastDayNth) {
    // 몇 일이 지나버렸는지 계산
    const howManyDayPassed = calcedTodayNth - lastDayNth;
    // 지나버린 날짜만큼 반복
    for (
      let eachDayPassed = 0;
      eachDayPassed < howManyDayPassed;
      eachDayPassed++
    ) {
      // 몇 번째 날짜인지 변수 업데이트
      todayNth = lastDayNth + eachDayPassed + 1;
      // 해당 날짜가 몇번째 주인지 변수 업데이트
      weekNth = parseInt((todayNth - 1) / 6) + 1;
      // 인덱스로 환산
      const idxForEachDayData = todayNth - 1;
      const idxForWinningNums = weekNth - 1;
      // 오늘자 데이터와 해당하는 주차 당첨정보 가져오기
      const todaysData = eachDayData[idxForEachDayData];
      const thisWeekWinningNum = winningNums[idxForWinningNums];
      // 위 둘 중 하나라도 정보가 없으면 그만함 안그러면 터짐
      if (todaysData === undefined || thisWeekWinningNum === undefined) break;
      // 데이터베이스에 계산된 날짜, 주차 정보 추가
      todaysData.dayNth = todayNth;
      todaysData.weekNth = weekNth;
      thisWeekWinningNum.weekNth = weekNth;
      // 하루에 몇개나 맞췄는지 담을 변수
      let sumHowManyMached = 0;
      // 각 조별 몇개나 맞췄는지 담을 변수
      todaysData.howManyMached = [];
      // 각 조별로 함수 실행
      todaysData.lottoSequences.forEach((eachLottoSequence, idx) => {
        // 이번 조에서 몇개나 맞췄는지 담을 변수에 만든 함수를 통한 결과 담기
        const howManyMached = comparingWinningNum(
          eachLottoSequence,
          thisWeekWinningNum.winningSequence
        );
        // 이번 조의 당첨 결과를 어레이에 푸쉬
        todaysData.howManyMached.push(howManyMached);
        // 이번 조의 당첨 결과를 변수에 누적 (하루 집계용)
        sumHowManyMached += howManyMached;
      });
      // 각 조별로 계산이 끝난 결과를 데이터베이스에 추가
      todaysData.sumHowManyMached = sumHowManyMached;
      // console.log(todaysData, thisWeekWinningNum);
      fireworks.push(new Fireworks(todaysData, thisWeekWinningNum));
    }
  }
  lastDayNth = calcedTodayNth;
};

const comparingWinningNum = (aSequence, winningSequence) => {
  let cnt = 0;
  for (let idx = 5; idx >= 0; idx--) {
    if (aSequence[idx] !== winningSequence[idx]) break;
    cnt++;
  }
  return cnt;
};

function draw() {
  image(img, 40, 30, img.width * 0.8, img.height * 0.8);

  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].update(gravity, windMag, frictionC);
    if (fireworks[idx].isDead) {
      fireworks.splice(idx, 1);
      console.log(fireworks.length);
    }
  }
  background(0, 25);
  timer(timeSpeed);
  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].display();
  }
  //요일
  const weekdays = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'];

  pg.clear();
  pg.fill(255);
  pg.textSize(18);
  pg.textAlign(CENTER);

  for (let idx = 0; idx < weekdays.length; idx++) {
    pg.text(weekdays[idx], eachDayX[idx], height - 40);
  }

  pg.textSize(14);
  pg.text(`${weekNth} 주    ${todayNth} 일째`, width / 2, 50);
  //행운 점수
  const numLines = Math.floor(height / 10) + 1;
  const dashLength = 5; // 점선의 간격

  for (let y = 0; y < numLines; y++) {
    const yPos = 160 + y * 63;
    const yyPos = 163 + y * 63;
    pg.textSize(14);
    pg.textAlign(LEFT);
    pg.textStyle(NORMAL);
    const num = 100 - y * 10;
    if (num > 0) {
      pg.text(num, 45, yPos + 10);
    }

    if (num < 10) {
      continue; // 숫자가 10보다 작을 경우에는 라인을 그리지 않습니다.
    }

    if (y < numLines - 1) {
      // 마지막 라인이 아닐 때만 점선을 그립니다.
      pg.stroke(100);
      for (let x = 80; x <= width - 80; x += dashLength * 2) {
        pg.line(x, yyPos, x + dashLength, yyPos);
      }
    }

    pg.noStroke();
  }

  image(pg, 0, 0);
}
