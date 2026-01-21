document.addEventListener("DOMContentLoaded", () => {
  const accordion = document.querySelector(".product-accordion");

  if (!accordion) {
    return;
  }

  accordion.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      const icon = item.querySelector(".product-accordion__icon");

      if (item.open) {
        icon.classList.add("open");
        accordion.querySelectorAll("details").forEach((other) => {
          if (other !== item) {
            other.open = false;
            other
              .querySelector(".product-accordion__icon")
              ?.classList.remove("open");
          }
        });
      } else {
        icon.classList.remove("open");
      }
    });
  });
});
