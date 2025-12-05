document.addEventListener("DOMContentLoaded", function () {
  const reviewCards = document.querySelectorAll(".review-card");

  reviewCards.forEach((card) => {
    const ratingContainer = card.querySelector(".review-card__rating");
    const rating = parseFloat(
      card.querySelector(".review-card__rating").getAttribute("aria-label")
    );

    renderStars(ratingContainer, rating);
  });

  function renderStars(container, rating) {
    const maxStars = 5;
    container.innerHTML = "";
    for (let i = 1; i <= maxStars; i++) {
      const star = document.createElement("span");
      star.setAttribute("role", "img");
      if (rating >= i) {
        star.className = "star full";
        star.setAttribute("aria-label", "Full star");
      } else if (rating >= i - 0.5) {
        star.className = "star half";
        star.setAttribute("aria-label", "Half star");
      } else {
        star.className = "star empty";
        star.setAttribute("aria-label", "Empty star");
      }
      container.appendChild(star);
    }
  }
});
