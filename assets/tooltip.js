function showTooltip(message) {
  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = message;

  requestAnimationFrame(() => {
    tooltip.classList.add("visible");
  });

  setTimeout(() => {
    tooltip.classList.remove("visible");
  }, 2000);
}
