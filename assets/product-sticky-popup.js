document.addEventListener("DOMContentLoaded", () => {
  if (!window.productData) return;

  const popup = document.querySelector(".product-sticky-popup");
  const colorsContainer = popup.querySelector(".product-sticky-popup__colors");
  const sizesContainer = popup.querySelector(".product-sticky-popup__sizes");
  const form = popup.querySelector("form");
  const applyBtn = popup.querySelector(".product-sticky-popup__btn");
  const variantInput = form.querySelector('input[name="id"]');
  const pageAddToBagBtn = document.querySelector(
    ".product-sticky__options-btn"
  );
  const closeBtn = popup.querySelector(".product-sticky-popup__close");

  const uniqueColors = [...new Set(productData.variants.map((v) => v.color))];
  uniqueColors.forEach((color, index) => {
    const variantForColor = productData.variants.find(
      (v) => v.color === color && v.gallery[0]
    );
    if (!variantForColor) return;

    const img = document.createElement("img");
    img.src = variantForColor.gallery[0];
    img.className = "product-sticky-popup__color-item";
    img.dataset.color = color;
    img.width = 88;
    img.height = 88;
    img.setAttribute("aria-label", color);
    if (index === 0) img.classList.add("active");

    colorsContainer.appendChild(img);

    img.addEventListener("click", () => {
      colorsContainer
        .querySelectorAll("img")
        .forEach((i) => i.classList.remove("active"));
      img.classList.add("active");

      const variant = productData.variants.find(
        (v) => v.color === color && v.available
      );
      if (!variant) return;

      updateSizes(color);
    });
  });

  function updateSizes(color) {
    sizesContainer.innerHTML = "";
    const variants = productData.variants.filter(
      (v) => v.color === color && v.available
    );

    variants.forEach((v, i) => {
      const sizeDiv = document.createElement("div");
      sizeDiv.className = "product-sticky-popup__size-item";
      sizeDiv.textContent = v.size;
      sizeDiv.dataset.variantId = v.id;
      sizeDiv.setAttribute("aria-label", `Size ${v.size}`);
      sizesContainer.appendChild(sizeDiv);

      if (i === 0) {
        sizeDiv.classList.add("active");
        variantInput.value = v.id;
      }

      sizeDiv.addEventListener("click", () => {
        sizesContainer
          .querySelectorAll("div")
          .forEach((d) => d.classList.remove("active"));
        sizeDiv.classList.add("active");
        variantInput.value = v.id;
      });
    });
  }

  if (uniqueColors.length > 0) {
    colorsContainer.querySelector("img").click();
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function showPopup() {
    if (!isMobile()) return;
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "false");

    const firstColor = colorsContainer.querySelector(
      ".product-sticky-popup__color-item"
    );
    if (firstColor && !firstColor.classList.contains("active")) {
      firstColor.click();
    }
  }

  function hidePopup() {
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "true");
  }

  if (pageAddToBagBtn) {
    pageAddToBagBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isMobile()) {
        showPopup();
      } else {
        const variantId = document.getElementById("StickyVariantId").value;
        if (!variantId) return;

        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Added to cart:", data);
            showTooltip("Product Added To Cart");
          })
          .catch((err) => console.error("Error adding to cart:", err));
      }
    });
  }

  closeBtn.addEventListener("click", hidePopup);

  applyBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let variantId = variantInput.value;

    if (!variantId) {
      const firstSize = sizesContainer.querySelector(
        ".product-sticky-popup__size-item"
      );
      if (firstSize) {
        firstSize.classList.add("active");
        variantId = firstSize.dataset.variantId;
        variantInput.value = variantId;
      } else {
        return;
      }
    }

    if (!variantId) return;

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Added to cart:", data);
        hidePopup();
        showTooltip("Product Added To Cart");
      })
      .catch((err) => console.error("Error adding to cart:", err));
  });

  window.addEventListener("resize", () => {
    if (!isMobile() && !popup.classList.contains("active")) {
      hidePopup();
    }
  });
});
