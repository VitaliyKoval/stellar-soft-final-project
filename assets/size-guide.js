document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".size-table__content", {
    direction: "horizontal",
    slidesPerView: "auto",
    freeMode: true,
  });

  let modal = document.querySelector(".modal");
  let body = document.querySelector("body");
  let close = document.querySelector(".modal__close");
  let openBtn = document.querySelector(".product__options-title-guide");

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    body.style.overflow = "hidden";
  });

  close.addEventListener("click", function () {
    modal.style.display = "none";
    body.style.overflow = "visible";
  });

  document.querySelector(".overlay").addEventListener("click", function () {
    modal.style.display = "none";
    body.style.overflow = "visible";
  });
});
