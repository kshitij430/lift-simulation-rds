import * as state from "./script.js";

export const liftDoorOpening = function (leftLiftDoor, rightLiftDoor) {
  leftLiftDoor.style.width = "0px";
  rightLiftDoor.style.width = "0px";
};

export const liftDoorClosing = function (leftLiftDoor, rightLiftDoor, chosenLift) {
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

export const moveLift = function (btn, chosenLift) {
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

export const generateHtml = function (nf, nl) {
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

export const identifyFreeLift = function (btn) {
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
