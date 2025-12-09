document.addEventListener("DOMContentLoaded", function () {
  const price = document.querySelector(".product__options-price");
  const productGallery = document.querySelector(".product__gallery-items");
  const mainImage = document.querySelector(".product__gallery-img");
  const groups = document.querySelector(".product__options-items");
  const sizesElement = document.querySelector(".product__options-sizes");
  const addButton = document.querySelector(".product__options-add");

  if (!productData) {
    return;
  }

  const uniqueColors = [
    ...new Set(productData.variants.map((v) => v.color)),
  ].slice(0, 3);
  const groupThumbs = [];

  uniqueColors.forEach((color, index) => {
    const found = productData.variants.find((v) => v.color === color);
    if (found) groupThumbs.push([...found.gallery]);

    const img = document.createElement("img");
    img.src = found.gallery[0];
    img.className = "product__options-item";
    img.dataset.color = color;
    img.setAttribute("role", "option");
    img.setAttribute("tabindex", "0");
    img.alt = `{{ product.title | escape }} thumbnail ${index + 1}`;
    img.loading = "lazy";
    img.fetchPriority = "low";
    if (index === 0) img.classList.add("active");
    groups.appendChild(img);
  });

  if (uniqueColors.length > 0) {
    const firstColor = uniqueColors[0];
    const variants = productData.variants.filter(
      (v) => v.color === firstColor && v.available
    );

    if (variants.length > 0) {
      updateStockIndicator(variants[0].id);
    }

    price.textContent = variants[0].price;

    sizesElement.innerHTML = "";
    variants.forEach((variant, i) => {
      const div = document.createElement("div");
      div.className = "product__options-size";
      if (i === 0) div.classList.add("active");
      div.dataset.variantId = variant.id;
      div.textContent = `UK ${variant.size}`;
      div.setAttribute("role", "option");
      div.setAttribute("tabindex", "0");
      sizesElement.appendChild(div);
    });

    productGallery.addEventListener("click", (e) => {
      const thumb = e.target.closest(".product__gallery-item");
      if (!thumb) return;

      const thumbsArray = Array.from(
        productGallery.querySelectorAll(".product__gallery-item")
      );
      const index = thumbsArray.indexOf(thumb);
      if (index === -1) return;

      thumbsArray.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");

      const currentColor = groups.querySelector(".product__options-item.active")
        .dataset.color;
      const variants = productData.variants.filter(
        (v) => v.color === currentColor && v.available
      );

      let largeImage = (variants[0].gallery[index] || thumb.src)
        .replace(/width=\d+/, "width=536")
        .replace(/height=\d+/, "height=536");
      mainImage.src = largeImage;
    });
  }

  const gallerySwiper = new Swiper(".product__gallery-swiper", {
    direction: "vertical",
    slidesPerView: "auto",
    freeMode: true,
    breakpoints: {
      1196: { direction: "vertical", spaceBetween: 24 },
      680: { direction: "horizontal", spaceBetween: 24 },
      0: { direction: "horizontal", spaceBetween: 16 },
    },
  });

  groups.addEventListener("click", (e) => {
    const groupImage = e.target.closest(".product__options-item");
    if (!groupImage) return;
    if (!groupImage.classList.contains("active")) {
      const color = groupImage.dataset.color;
      const variants = productData.variants.filter(
        (v) => v.color === color && v.available
      );

      price.textContent = variants[0].price;

      sizesElement.innerHTML = "";
      variants.forEach((variant, i) => {
        const div = document.createElement("div");
        div.className = "product__options-size";
        if (i === 0) div.classList.add("active");
        div.dataset.variantId = variant.id;
        div.textContent = `UK ${variant.size}`;
        sizesElement.appendChild(div);
      });
      if (variants.length > 0) {
        updateStockIndicator(variants[0].id);
      }

      document.querySelector('form input[name="id"]').value = variants[0].id;

      productGallery
        .querySelectorAll(".product__gallery-item")
        .forEach((thumb, index) => {
          thumb.src = variants[0].gallery[index] || thumb.src;
          thumb.classList.toggle("active", index === 0);
        });

      mainImage.src = variants[0].gallery[0]
        .replace(/width=\d+/, "width=536")
        .replace(/height=\d+/, "height=536");
      groups
        .querySelector(".product__options-item.active")
        ?.classList.remove("active");
      groupImage.classList.add("active");
    }
  });

  sizesElement.addEventListener("click", (e) => {
    const sizeElement = e.target.closest(".product__options-size");
    if (!sizeElement) return;
    sizesElement
      .querySelector(".product__options-size.active")
      ?.classList.remove("active");
    sizeElement.classList.add("active");
    document.querySelector('form input[name="id"]').value =
      sizeElement.dataset.variantId;
    updateStockIndicator(sizeElement.dataset.variantId);
  });

  addButton.addEventListener("click", (e) => {
    e.preventDefault();
    const activeSize = sizesElement.querySelector(
      ".product__options-size.active"
    );
    if (!activeSize) return;
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeSize.dataset.variantId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Added to cart:", data))
      .catch((err) => console.error("Error adding to cart:", err));
  });

  function updateStockIndicator(variantId) {
    const variant = productData.variants.find((v) => v.id == variantId);
    const indicator = document.querySelector(".product__options-indicator");
    if (!variant || !indicator) return;

    const qty = variant.inventory_quantity;

    indicator.classList.remove("stock-in", "stock-running", "stock-low");

    if (qty >= 5) {
      indicator.textContent = "In Stock";
      indicator.classList.add("stock-in");
    } else if (qty >= 3) {
      indicator.textContent = "Running Out";
      indicator.classList.add("stock-running");
    } else if (qty >= 1) {
      indicator.textContent = "Low Stock";
      indicator.classList.add("stock-low");
    }
  }

  const sticky = document.querySelector(".product-sticky");
  const trigger = document.querySelector(".product-sticky-trigger");

  if (!sticky || !trigger) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sticky.classList.add("u-hidden");
        } else {
          sticky.classList.remove("u-hidden");
        }
      });
    },
    {
      rootMargin: "0px 0px 0px 0px",
      threshold: 0,
    }
  );

  observer.observe(trigger);
});
