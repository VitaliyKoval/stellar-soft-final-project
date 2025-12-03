document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".footer__section");

  if (window.innerWidth < 768) {
    sections.forEach((section, index) => {
      if (index === 0) {
        section.setAttribute("open", "");
      } else {
        section.removeAttribute("open");
        section.querySelector(".footer-icon").classList.add("close");
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      sections.forEach((section, index) => {
        if (index === 0) {
          section.setAttribute("open", "");
        } else {
          section.removeAttribute("open");
          section.querySelector(".footer-icon").classList.add("close");
        }
      });
    } else {
      sections.forEach((section) => {
        section.setAttribute("open", "open");
        section.querySelector(".footer-icon").classList.remove("close");
      });
    }
  });

  const footerConainer = document.querySelector(".footer__container");
  footerConainer.addEventListener("click", (e) => {
    const summary = e.target.closest(".footer__title");
    if (!summary) return;
    summary.querySelector(".footer-icon").classList.toggle("close");
  });
});
