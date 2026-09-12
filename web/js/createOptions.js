import { fetchNui } from "./fetchNui.js";

const optionsWrapper = document.getElementById("options-wrapper");

function onClick() {
  this.style.pointerEvents = "none";

  fetchNui("select", [this.targetType, this.targetId, this.zoneId]);

  setTimeout(() => (this.style.pointerEvents = "auto"), 100);
}

function createBadge(data) {
  if (!data.icon) return "";

  const colored = data.iconColor ? " is-colored" : "";
  const style = data.iconColor ? ` style="--badge: ${data.iconColor}"` : "";

  return `<span class="option-badges"><span class="option-badge${colored}"${style}><i class="fa-fw ${data.icon}"></i></span></span>`;
}

export function createOptions(type, data, id, zoneId) {
  if (data.hide) return;

  const index = optionsWrapper.getElementsByClassName("option").length;
  const option = document.createElement("div");

  option.className = "option";
  option.style.setProperty("--i", index);
  option.innerHTML = `<div class="option-body">
      <span class="option-node">
        <span class="node-dot"></span>
        <svg class="node-cross" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M7.4 7.4 L16.6 16.6 M16.6 7.4 L7.4 16.6"></path>
        </svg>
      </span>
      ${createBadge(data)}
      <p class="option-label">${data.label}</p>
    </div>`;

  option.targetType = type;
  option.targetId = id;
  option.zoneId = zoneId;

  option.addEventListener("click", onClick);
  optionsWrapper.appendChild(option);

  return option;
}
