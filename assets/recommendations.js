document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".collection");
  if (!section) return;

  const wrapper = document.querySelector(".collection__cards");
  const productId = wrapper.dataset.productId;
  const limit = wrapper.dataset.productsLimit;

  fetch(`/recommendations/products.json?product_id=${productId}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.products || data.products.length === 0) return;

      wrapper.innerHTML = data.products
        .map((product) => {
          const price = (product.price / 100).toFixed(2);
          const image = product.featured_image;

          return `
            <article class="swiper-slide collection__card">
              <a href="${product.url}">
                <img
                  class="collection__card-img"
                  src="${image}"
                  alt="${product.title}"
                  loading="lazy"
                  fetchpriority="low"
                  width="300"
                  height="300"
                >
                <div class="collection__card-info">
                  <h3 class="collection__card-name">${product.title}</h3>
                  <span class="collection__card-price">$${price}</span>
                </div>
              </a>
            </article>`;
        })
        .join("");

      const swiperCollection = new Swiper(".collection__swiper", {
        slidesPerView: "auto",
        freeMode: true,
        loop: false,
        spaceBetween: 24,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    })
    .catch((err) => console.error("Error loading recommendations:", err));
});
