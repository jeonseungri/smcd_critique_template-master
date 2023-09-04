import { studentInfo } from "./studentInfo.js";

document.title = `${studentInfo.성명} ${studentInfo.학번} ${studentInfo.평가회차}차`;

const title = document.querySelector("#title");
title.innerHTML = `커뮤니케이션디자인전공</br>${studentInfo.평가연도}년도 졸업작품 ${studentInfo.평가회차}차 평가`;
const subtitle = document.querySelector("#subtitle");
subtitle.innerHTML = `${studentInfo.성명} ${studentInfo.학번}`;

const profBtns = document.querySelectorAll(".subject");
profBtns.forEach((eachProf, idx) => {
  const propName = `지도교수${idx + 1}`;
  eachProf.innerHTML = `${studentInfo[propName]}교수님`;
});

const studentListBtn = document.querySelector("#studentList");
studentListBtn.href = "https://spctrm404.github.io/smcd_dsc_2023_1";
