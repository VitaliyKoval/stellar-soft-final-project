document.addEventListener("DOMContentLoaded", function () {
  const price = document.querySelector(".product__options-price");
  const productGallery = document.querySelector(".product__gallery-items");
  const mainContainer = document.querySelector(".product__gallery-main");
  const groups = document.querySelector(".product__options-items");
  const sizesElement = document.querySelector(".product__options-sizes");
  const addButton = document.querySelector(".product__options-add");

  if (!productData) return;

  let gallerySwiper = null;

  function makeLargeImageUrl(url) {
    try {
      return url
        .replace(/width=\d+/, "width=536")
        .replace(/height=\d+/, "height=536");
    } catch (e) {
      return url;
    }
  }

  function renderGallerySlides(variant) {
    productGallery.innerHTML = "";

    (variant.gallery || []).forEach((img, index) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `
        <img
          src="${img}"
          class="product__gallery-item ${index === 0 ? "active" : ""}"
          data-type="image"
          data-src="${img}"
          data-src-large="${makeLargeImageUrl(img)}"
          width="88"
          height="88"
          loading="lazy"
          alt="Product thumbnail ${index + 1}"
        >
      `;
      productGallery.appendChild(slide);
    });

    (variant.video_urls || []).forEach((src) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div
          class="product__gallery-item product__gallery-thumb"
          role="button"
          tabindex="0"
          data-type="video_url"
          data-src="${src}"
          aria-label="Video URL thumbnail"
        >
          <span class="product__thumb-placeholder"></span>
        </div>
      `;
      productGallery.appendChild(slide);
    });

    if (!gallerySwiper) {
      gallerySwiper = new Swiper(".product__gallery-swiper", {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        breakpoints: {
          1196: { direction: "vertical", spaceBetween: 24 },
          680: { direction: "horizontal", spaceBetween: 24 },
          0: { direction: "horizontal", spaceBetween: 16 },
        },
      });

      gallerySwiper.on("slideChange", handleSlideChange);
      gallerySwiper.on("progress", handleSlideChange);
    } else {
      gallerySwiper.update();
    }
  }

  function renderMainMediaByType(type, src, optionalLarge) {
    mainContainer.innerHTML = "";

    if (type === "image") {
      const img = document.createElement("img");
      img.className = "product__gallery-img";
      img.src = optionalLarge || src;
      img.alt = "Product image";
      img.width = 536;
      img.height = 536;
      img.loading = "eager";
      img.fetchPriority = "high";
      mainContainer.appendChild(img);
    } else if (type === "video_url") {
      const iframe = document.createElement("iframe");
      iframe.className = "product__gallery-iframe";
      iframe.width = "536";
      iframe.height = "536";
      iframe.allow = "autoplay; fullscreen; encrypted-media";
      iframe.setAttribute("allowfullscreen", "");

      if (src.includes("youtube.com")) {
        const match = src.match(/[?&]v=([^&]+)/);
        const videoId = match ? match[1] : null;
        iframe.src = videoId
          ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
          : src;
      } else if (src.includes("vimeo.com")) {
        const m = src.match(/vimeo\.com\/(\d+)/);
        const id = m ? m[1] : null;
        iframe.src = id
          ? `https://player.vimeo.com/video/${id}?autoplay=1&muted=1`
          : src;
      } else {
        iframe.src = src;
      }
      mainContainer.appendChild(iframe);

      setupMainIframeObserver(mainContainer.querySelector("iframe"));
    }
  }

  function setupMainIframeObserver(iframeEl) {
    if (!iframeEl) return;
    const originalSrc = iframeEl.src;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (iframeEl.src.includes("autoplay=1")) {
              iframeEl.src = originalSrc.replace(
                /([?&])autoplay=1(&)?/,
                (m, p1, p2) => (p2 ? p1 : "")
              );
            }
          } else {
            if (!iframeEl.src.includes("autoplay=1")) {
              const sep = iframeEl.src.includes("?") ? "&" : "?";
              iframeEl.src = iframeEl.src + sep + "autoplay=1&mute=1";
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    io.observe(iframeEl);
  }

  function onGalleryClickHandler(e) {
    const slide = e.target.closest(".swiper-slide");
    if (!slide) return;

    const thumb =
      slide.querySelector("[data-type]") ||
      slide.querySelector(".product__gallery-thumb");
    if (!thumb) return;

    productGallery
      .querySelectorAll(".product__gallery-item, .product__gallery-thumb")
      .forEach((el) => {
        el.classList.remove("active");
      });

    if (thumb.classList) thumb.classList.add("active");

    const type = thumb.dataset.type;
    const src = thumb.dataset.src;
    const large = thumb.dataset.srcLarge;

    renderMainMediaByType(type || "image", src || large, large);
  }

  function handleSlideChange() {
    const activeIndex = gallerySwiper?.activeIndex ?? 0;
    const slides = Array.from(productGallery.querySelectorAll(".swiper-slide"));
    slides.forEach((s, i) => {
      const thumb =
        s.querySelector("[data-type]") ||
        s.querySelector(".product__gallery-thumb");
      if (!thumb) return;
      thumb.classList.toggle("active", i === activeIndex);
    });

    const activeSlide = slides[activeIndex];
    if (!activeSlide) return;
    const thumb =
      activeSlide.querySelector("[data-type]") ||
      activeSlide.querySelector(".product__gallery-thumb");
    if (!thumb) return;
    const type = thumb.dataset.type;
    const src = thumb.dataset.src;
    const large = thumb.dataset.srcLarge;
    renderMainMediaByType(type || "image", src || large, large);
  }

  function initVariantGalleryAndMain(variant) {
    renderGallerySlides(variant);

    const firstThumb =
      productGallery.querySelector("[data-type]") ||
      productGallery.querySelector(".product__gallery-item");
    if (firstThumb) {
      const type = firstThumb.dataset.type || "image";
      const src = firstThumb.dataset.src || firstThumb.src;
      const large = firstThumb.dataset.srcLarge || null;
      renderMainMediaByType(type, src, large);

      productGallery
        .querySelectorAll(".product__gallery-item, .product__gallery-thumb")
        .forEach((el, i) => {
          el.classList.toggle("active", i === 0);
        });
    }

    productGallery.removeEventListener("click", onGalleryClickHandler);
    productGallery.addEventListener("click", onGalleryClickHandler);
  }

  const uniqueColors = [...new Set(productData.variants.map((v) => v.color))];
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

    initVariantGalleryAndMain(variants[0]);
  }

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

      initVariantGalleryAndMain(variants[0]);

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

    const variantId = Number(sizeElement.dataset.variantId);
    const variant = productData.variants.find((v) => v.id === variantId);
    if (variant) {
      initVariantGalleryAndMain(variant);
    }
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

  console.log(productData);
});
