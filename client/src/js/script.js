"use strict";
import { generateHtml, identifyFreeLift } from "./helpers.js";
// connecting to the server
const sock = io();

// VARIABLES
const form = document.querySelector("#form");
const liftSimulateSection = document.querySelector("#lift-simulate");
const state = {
  lifts: [],
  activeLifts: [],
};

// FORM
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const totalFloors = Number(document.querySelector("#floor").value);
  const totalLifts = Number(document.querySelector("#lift").value);
  if (totalLifts > 6) {
    return alert("Maximum Lift Count is 6");
  }
  const html = generateHtml(totalFloors, totalLifts);
  liftSimulateSection.innerHTML = html;
  const upBtns = document.querySelectorAll("#up");
  const downBtns = document.querySelectorAll("#down");
  // INITIALIZE LIFTS
  const lifts = document.querySelectorAll("#liftBox");
  lifts.forEach((lift) => {
    state.lifts.push({
      lift,
      floornum: 0,
      destFloorOnRoute: -1,
      liftnum: +lift.dataset.liftnum,
    });
  });
  // EVENT LISTENERS
  sock.on("message", (text) => {
    if (text?.upBtn) {
      identifyFreeLift(text.upBtn);
    }
    if (text?.downBtn) {
      identifyFreeLift(text.downBtn);
    }
  });
  upBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      sock.emit("message", { upBtn: this.dataset.floornum });
      identifyFreeLift(this.dataset.floornum);
    });
  });
  downBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      sock.emit("message", { downBtn: this.dataset.floornum });
      identifyFreeLift(this.dataset.floornum);
    });
  });
});

export { state };
