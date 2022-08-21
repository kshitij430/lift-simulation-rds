import * as state from "./script.js";

const liftDoorOpening = function (leftLiftDoor, rightLiftDoor) {
  leftLiftDoor.style.width = "0px";
  rightLiftDoor.style.width = "0px";
};

const liftDoorClosing = function (leftLiftDoor, rightLiftDoor, chosenLift) {
  leftLiftDoor.style.width = "50px";
  rightLiftDoor.style.width = "50px";

  const index = state.state.activeLifts.findIndex((val) => {
    return val.lift === chosenLift.lift;
  });
  setTimeout(() => {
    chosenLift.destFloorOnRoute = -1;
    state.state.activeLifts.splice(index, 1);
  }, 1500);
};

const moveLift = function (btn, chosenLift) {
  const floorNum = +btn;
  chosenLift.lift.style.top = `-${280 * (floorNum - 1) + floorNum}px`;
  chosenLift.lift.style.transition = `all ${2 * Math.abs(floorNum - chosenLift.floornum)}s ease-in-out`;
  const leftLiftDoor = chosenLift.lift.querySelector(".left-door");
  const rightLiftDoor = chosenLift.lift.querySelector(".right-door");

  setTimeout(function () {
    liftDoorOpening(leftLiftDoor, rightLiftDoor);
  }, 2000 * Math.abs(floorNum - chosenLift.floornum));
  setTimeout(function () {
    chosenLift.floornum = floorNum;
    liftDoorClosing(leftLiftDoor, rightLiftDoor, chosenLift);
  }, 2000 * Math.abs(floorNum - chosenLift.floornum) + 2500);
};

const generateHtml = function (nf, nl) {
  let html = "";
  let liftHtml = "";
  for (let i = 1; i <= nl; i++) {
    liftHtml += `<div id="liftBox" data-liftNum=${i} style="position:absolute; top:0px; left: ${i * 200}px">
          <div class='left-door'></div>
          <div class='right-door'></div>
      </div>`;
  }
  for (let i = nf; i >= 1; i--) {
    html += `
      <div class="floor">
          <div class="floor-buttons">
              ${i < nf ? `<button id="up" data-floorNum=${i}>Up</button>` : ""}
              ${i > 1 ? `<button id="down" data-floorNum=${i}>Down</button>` : ""}
          </div>
          ${i == 1 ? liftHtml : ""}
          <div class="floor-label"></div>
      </div>
      <h4>Floor ${i}</h4>
      <div id="border"></div> 
      `;
  }
  return html;
};

const identifyFreeLift = function (btn) {
  const toFloorNum = +btn;
  let res = 1000;
  let chosenLift;
  let moving = false;
  // guard clause
  state.state.lifts.forEach((lift) => {
    if (lift.destFloorOnRoute === toFloorNum) moving = true;
  });
  if (moving) return;
  state.state.lifts.forEach((lift) => {
    if (Math.abs(toFloorNum - lift.floornum) < res && !state.state.activeLifts.includes(lift)) {
      chosenLift = lift;
      chosenLift.destFloorOnRoute = toFloorNum;
      res = Math.abs(toFloorNum - lift.floornum);
    }
  });
  if (chosenLift) {
    let flag;
    for (const el of state.state.activeLifts) {
      if (el.lliftnum === chosenLift.lliftnum) flag = false;
    }
    if (!flag) {
      state.state.activeLifts.push(chosenLift);
      moveLift(btn, chosenLift);
    }
  }
};

export const initialHTML = function (totalFloors, totalLifts) {
  const html = generateHtml(totalFloors, totalLifts);
  const liftSimulateSection = document.querySelector("#lift-simulate");
  liftSimulateSection.innerHTML = html;
  const upBtns = document.querySelectorAll("#up");
  const downBtns = document.querySelectorAll("#down");
  // INITIALIZE LIFTS
  const lifts = document.querySelectorAll("#liftBox");
  state.state.lifts = [];
  lifts.forEach((lift) => {
    state.state.lifts.push({
      lift,
      floornum: 0,
      destFloorOnRoute: -1,
      liftnum: +lift.dataset.liftnum,
    });
  });
  // EVENT LISTENERS
  state.sock.on("message", (text) => {
    if (text?.upBtn) {
      identifyFreeLift(text.upBtn);
    }
    if (text?.downBtn) {
      identifyFreeLift(text.downBtn);
    }
  });
  upBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      state.sock.emit("message", { upBtn: this.dataset.floornum });
      identifyFreeLift(this.dataset.floornum);
    });
  });
  downBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      state.sock.emit("message", { downBtn: this.dataset.floornum });
      identifyFreeLift(this.dataset.floornum);
    });
  });
};
