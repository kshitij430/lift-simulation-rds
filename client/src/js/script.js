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
sock.on("new-connection", (users) => {
  window.scrollTo(0, 0);
  if (users <= 1) return;
  document.querySelector("#new-connection").classList.remove("hidden");
  setTimeout(function () {
    document.querySelector("#new-connection").classList.add("hidden");
  }, 3000);
  initialHTML(8, 3);
});
initialHTML(8, 3);
export { state, sock };
