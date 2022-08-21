"use strict";
import { initialHTML } from "./helpers.js";
// connecting to the server
const sock = io();
// VARIABLES
const form = document.querySelector("#form");

const state = {
  lifts: [],
  activeLifts: [],
};

sock.on("dom-update", (text) => {
  const totalFloors = +document.querySelector("#floor").value;
  const totalLifts = +document.querySelector("#lift").value;
  console.log(totalFloors);
  if (totalFloors === text.totalFloors && totalLifts === text.totalLifts) return;
  document.querySelector("#floor").value = text.totalFloors;
  document.querySelector("#lift").value = text.totalLifts;
  initialHTML(text.totalFloors, text.totalLifts);
});
// FORM
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const totalFloors = Number(document.querySelector("#floor").value);
  const totalLifts = Number(document.querySelector("#lift").value);
  if (totalLifts > 6) {
    return alert("Maximum Lift Count is 6");
  }
  sock.emit("dom-update", { totalFloors, totalLifts });
  initialHTML(totalFloors, totalLifts);
});
initialHTML(8, 3);
export { state, sock };
