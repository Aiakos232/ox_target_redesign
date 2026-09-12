import { createOptions } from "./createOptions.js";

const optionsWrapper = document.getElementById("options-wrapper");
const reticle = document.getElementById("reticle");
const rail = optionsWrapper.getElementsByClassName("rail")[0];
const body = document.body;

let rows = [];
let activeIndex = 0;

function paint() {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const distance = Math.min(Math.abs(i - activeIndex), 3);

    row.dataset.dist = distance;
    row.dataset.side = i < activeIndex ? "up" : i > activeIndex ? "down" : "on";
    row.classList.toggle("is-active", i === activeIndex);
  }
}

function setActive(index) {
  if (!rows.length) return;

  const clamped = Math.max(0, Math.min(rows.length - 1, index));

  if (clamped === activeIndex) return;

  activeIndex = clamped;
  paint();
}

function clearOptions() {
  for (const row of rows) row.remove();

  rows = [];
  activeIndex = 0;
  rail.classList.add("is-empty");
  optionsWrapper.classList.remove("is-dense");
  reticle.classList.remove("has-target");
}

function addOption(type, data, id, zoneId) {
  const row = createOptions(type, data, id, zoneId);

  if (!row) return;

  const index = rows.length;

  row.addEventListener("mouseenter", () => setActive(index));
  rows.push(row);
}

window.addEventListener("wheel", (event) => {
  if (!rows.length) return;

  setActive(activeIndex + (event.deltaY > 0 ? 1 : -1));
});

window.addEventListener("keydown", (event) => {
  if (!rows.length) return;

  switch (event.key) {
    case "ArrowDown":
      return setActive(activeIndex + 1);
    case "ArrowUp":
      return setActive(activeIndex - 1);
    case "Enter":
      return rows[activeIndex]?.click();
  }
});

window.addEventListener("message", (event) => {
  switch (event.data.event) {
    case "visible": {
      clearOptions();
      body.style.visibility = event.data.state ? "visible" : "hidden";
      return;
    }

    case "leftTarget": {
      return clearOptions();
    }

    case "setTarget": {
      clearOptions();

      if (event.data.options) {
        for (const type in event.data.options) {
          event.data.options[type].forEach((data, id) => {
            addOption(type, data, id + 1);
          });
        }
      }

      if (event.data.zones) {
        for (let i = 0; i < event.data.zones.length; i++) {
          event.data.zones[i].forEach((data, id) => {
            addOption("zones", data, id + 1, i + 1);
          });
        }
      }

      if (!rows.length) return;

      reticle.classList.add("has-target");
      rail.classList.toggle("is-empty", rows.length < 2);
      optionsWrapper.classList.toggle("is-dense", rows.length > 13);
      paint();
    }
  }
});
