document.addEventListener("DOMContentLoaded", () => {
  if (!window.productData) return;

  const stickyImg = document.querySelector(".product__content-left-img");
  const priceOriginal = document.querySelector(
    ".product-sticky__content-price--original"
  );
  const priceSale = document.querySelector(
    ".product-sticky__content-price--sale"
  );
  const stickyVariantInput = document.getElementById("StickyVariantId");
  const stickyColorItems = document.querySelector(
    ".product-sticky__options-colors-items"
  );
  const customSelect = document.getElementById("StickyCustomSelect");
  const selectedDiv = customSelect.querySelector(".selected");
  const optionsDiv = customSelect.querySelector(".options");
  const content = document.querySelector(".product-sticky__content");
  const stickyOptions = document.querySelector(".product-sticky__options");
  const stickyForm = stickyOptions.querySelector("form");
  const addToBagBtn = stickyForm.querySelector(".product-sticky__options-btn");

  const uniqueColors = [...new Set(productData.variants.map((v) => v.color))];

  uniqueColors.forEach((color, index) => {
    const variant = productData.variants.find((v) => v.color === color);
    if (!variant || !variant.gallery[0]) return;

    const img = document.createElement("img");
    img.src = variant.gallery[0];
    img.dataset.color = color;
    img.className = "product-sticky__options-colors-item";
    img.width = 24;
    img.height = 24;
    img.setAttribute("aria-label", color);
    if (index === 0) {
      img.classList.add("active");
    }
    stickyColorItems.appendChild(img);

    img.addEventListener("click", () => {
      stickyColorItems
        .querySelectorAll("img")
        .forEach((i) => i.classList.remove("active"));
      img.classList.add("active");

      const colorVariants = productData.variants.filter(
        (v) => v.color === color && v.available
      );
      if (!colorVariants.length) return;

      updateSticky(colorVariants[0]);
      updateCustomSelect(colorVariants);
    });
  });

  function updateSticky(variant) {
    stickyImg.src = variant.gallery[0];
    priceSale.textContent = variant.price;
    priceOriginal.textContent = variant.compare_at_price || "";
    stickyVariantInput.value = variant.id;
  }

  function updateCustomSelect(variants) {
    optionsDiv.innerHTML = "";
    variants.forEach((v, i) => {
      const option = document.createElement("div");
      option.textContent = `UK ${v.size}`;
      option.dataset.value = v.id;
      option.setAttribute("aria-label", `Size ${v.size}`);
      if (i === 0) selectedDiv.textContent = option.textContent;
      optionsDiv.appendChild(option);

      option.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedDiv.textContent = option.textContent;
        const selVariant = variants.find((x) => x.id == option.dataset.value);
        if (selVariant) updateSticky(selVariant);
        customSelect.classList.remove("active");
      });
    });
  }

  selectedDiv.addEventListener("click", () => {
    customSelect.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("active");
    }
  });

  const firstColorVariants = productData.variants.filter(
    (v) => v.color === uniqueColors[0] && v.available
  );
  updateSticky(firstColorVariants[0]);
  updateCustomSelect(firstColorVariants);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  addToBagBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
    }
  });
});
