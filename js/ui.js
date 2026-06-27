/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * UI
 * ==========================================================
 */

function formatMoney(value) {
  return BUSINESS.settings.currency + " " + Number(value || 0).toLocaleString();
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProductPrice(product) {
  if (product.tipoVenta === "weight") {
    return formatMoney(product.precioKg) + " / kg";
  }

  return formatMoney(product.precioUnidad);
}

function getPlaceholderImage() {
  return "https://placehold.co/500x500?text=Producto";
}

function renderApp(handlers) {
  renderBusinessTheme();
  renderHeader();
  renderCart(handlers);
  renderCategories(handlers);
  renderProducts(handlers);
  renderCheckout(handlers);
}

function renderBusinessTheme() {
  document.documentElement.style.setProperty("--primary", BUSINESS.theme.primary);
  document.documentElement.style.setProperty("--primary-dark", BUSINESS.theme.primaryDark);
  document.documentElement.style.setProperty("--primary-soft", BUSINESS.theme.primarySoft);
}

function renderHeader() {
  const container = document.getElementById("store-header");

  const availabilityText =
    BUSINESS.availability.status === "open"
      ? "Abierto"
      : BUSINESS.availability.status === "temporary"
        ? "Cerrado temporalmente"
        : "Cerrado";

  container.innerHTML = `
    <div class="store-header-inner">
      <div class="brand-kicker">Vitrina Express by ASTREA™</div>

      <div class="store-title-row">
        <div>
          <h1>${escapeHTML(BUSINESS.info.name)}</h1>
          <p>${escapeHTML(BUSINESS.info.slogan)}</p>
        </div>
      </div>

      <div class="store-status ${BUSINESS.availability.status}">
        ${availabilityText} · ${BUSINESS.schedule.open} a ${BUSINESS.schedule.close}
      </div>

      ${
        BUSINESS.settings.enableSearch
          ? `
            <div class="search-box">
              <span>🔎</span>
              <input id="searchInput" type="search" placeholder="Buscar productos">
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderCategories(handlers) {
  const container = document.getElementById("category-section");

  if (!BUSINESS.settings.enableCategories) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <section class="accordion ${STATE.ui.categoriesOpen ? "open" : ""}">
      <button class="accordion-head" id="toggleCategoriesBtn" type="button">
        <span>Categorías</span>
        <strong>${escapeHTML(STATE.activeCategory)}</strong>
        <span>${STATE.ui.categoriesOpen ? "⌃" : "⌄"}</span>
      </button>

      <div class="accordion-body">
        <div class="category-chip-list">
          ${STATE.categories
            .map(category => {
              const active = category === STATE.activeCategory;

              return `
                <button 
                  class="category-chip ${active ? "active" : ""}" 
                  data-category="${escapeHTML(category)}"
                  type="button"
                >
                  ${active ? "✓ " : ""}${escapeHTML(category)}
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;

  document
    .getElementById("toggleCategoriesBtn")
    .addEventListener("click", handlers.onToggleCategories);

  container.querySelectorAll(".category-chip").forEach(button => {
    button.addEventListener("click", () => {
      handlers.onCategorySelect(button.dataset.category);
    });
  });
}

function renderProducts(handlers) {
  const container = document.getElementById("product-grid");

  if (STATE.ui.loading) {
    container.innerHTML = `
      <div class="empty-state">Cargando productos...</div>
    `;
    return;
  }

  if (!STATE.filteredProducts.length) {
    container.innerHTML = `
      <div class="empty-state">No se encontraron productos.</div>
    `;
    return;
  }

  container.innerHTML = STATE.filteredProducts
    .map(product => {
      const added = isProductInCart(product.id);
      const isWeight = product.tipoVenta === "weight";
      const image = product.imagen || getPlaceholderImage();
      const initialValue = isWeight ? 250 : 1;
      const label = isWeight ? "g" : "";

      return `
        <article class="product-card ${added ? "added" : ""}" data-product-id="${escapeHTML(product.id)}">
          ${added ? `<div class="product-check">✓</div>` : ""}

          <div class="product-image">
            <img src="${escapeHTML(image)}" alt="${escapeHTML(product.nombre)}">
          </div>

          <div class="product-info">
            <div class="product-category">${escapeHTML(product.categoria || "General")}</div>
            <h3>${escapeHTML(product.nombre)}</h3>
            <div class="product-price">${getProductPrice(product)}</div>

            <div class="quantity-control" data-value="${initialValue}" data-type="${isWeight ? "weight" : "unit"}">
              <button class="qty-minus" type="button">−</button>
              <strong class="qty-value">${initialValue}${label}</strong>
              <button class="qty-plus" type="button">+</button>
            </div>

            <button class="btn btn-primary add-product-btn" type="button">
              Agregar
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".product-card").forEach(card => {
    const productId = card.dataset.productId;
    const product = STATE.products.find(item => String(item.id) === String(productId));
    const control = card.querySelector(".quantity-control");
    const valueEl = card.querySelector(".qty-value");

    card.querySelector(".qty-minus").addEventListener("click", () => {
      const type = control.dataset.type;
      const step = type === "weight" ? BUSINESS.settings.weightStep : 1;
      const min = type === "weight" ? BUSINESS.settings.minWeight : 1;

      let value = Number(control.dataset.value);
      value = Math.max(min, value - step);

      control.dataset.value = value;
      valueEl.textContent = type === "weight" ? value + "g" : value;
    });

    card.querySelector(".qty-plus").addEventListener("click", () => {
      const type = control.dataset.type;
      const step = type === "weight" ? BUSINESS.settings.weightStep : 1;
      const max = type === "weight" ? BUSINESS.settings.maxWeight : 99;

      let value = Number(control.dataset.value);
      value = Math.min(max, value + step);

      control.dataset.value = value;
      valueEl.textContent = type === "weight" ? value + "g" : value;
    });

    card.querySelector(".add-product-btn").addEventListener("click", () => {
      handlers.onAddProduct(product, Number(control.dataset.value));
    });
  });
}

function renderCart(handlers) {
  const container = document.getElementById("cart-section");
  const count = getCartCount();
  const total = getCartTotal();

  container.innerHTML = `
    <section class="accordion cart-accordion ${STATE.ui.cartOpen ? "open" : ""}">
      <button class="accordion-head ${count ? "has-items" : ""}" id="toggleCartBtn" type="button">
        <span>Tu pedido</span>
        <strong>${count ? count + " item(s) · " + formatMoney(total) : "Vacío"}</strong>
        <span>${STATE.ui.cartOpen ? "⌃" : "⌄"}</span>
      </button>

      <div class="accordion-body">
        ${
          STATE.cart.length
            ? `
              <div class="cart-list">
                ${STATE.cart
                  .map((item, index) => renderCartItem(item, index))
                  .join("")}
              </div>
            `
            : `<div class="empty-cart">No hay productos agregados.</div>`
        }
      </div>
    </section>
  `;

  document
    .getElementById("toggleCartBtn")
    .addEventListener("click", handlers.onToggleCart);

  container.querySelectorAll(".cart-remove").forEach(button => {
    button.addEventListener("click", () => {
      handlers.onRemoveCartItem(Number(button.dataset.index));
    });
  });
}

function renderCartItem(item, index) {
  const image = item.imagen || getPlaceholderImage();

  const quantityText =
    item.tipoVenta === "unit"
      ? item.cantidad + " unidad(es)"
      : item.gramos + " g";

  return `
    <div class="cart-item">
      <img src="${escapeHTML(image)}" alt="${escapeHTML(item.nombre)}">

      <div class="cart-item-info">
        <strong>${escapeHTML(item.nombre)}</strong>
        <span>${quantityText}</span>
        <span>${formatMoney(item.subtotal)}</span>
      </div>

      <button class="cart-remove" data-index="${index}" type="button">×</button>
    </div>
  `;
}

function renderCheckout(handlers) {
  const container = document.getElementById("checkout-section");

  const customerName = STATE.customer.name || "";
  const customerPhone = STATE.customer.phone || "";

  container.innerHTML = `
    <section class="checkout-card">
      <div class="checkout-total">
        <span>Total estimado</span>
        <strong>${formatMoney(getCartTotal())}</strong>
      </div>

      <div class="checkout-fields">
        <input id="customerName" type="text" placeholder="Tu nombre" value="${escapeHTML(customerName)}">
        <input id="customerPhone" type="tel" placeholder="Tu teléfono" value="${escapeHTML(customerPhone)}">
        <textarea id="customerNote" placeholder="Observación del pedido"></textarea>
      </div>

      <p class="checkout-help">
        Al continuar se abrirá WhatsApp para confirmar el envío del pedido.
      </p>

      <button id="sendOrderBtn" class="btn btn-primary" type="button" ${STATE.ui.sending ? "disabled" : ""}>
        ${STATE.ui.sending ? "Enviando..." : "Enviar pedido"}
      </button>
    </section>
  `;

  document
    .getElementById("sendOrderBtn")
    .addEventListener("click", handlers.onSendOrder);
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-root");

  container.innerHTML = `
    <div class="toast ${type}">
      ${escapeHTML(message)}
    </div>
  `;

  setTimeout(() => {
    container.innerHTML = "";
  }, 3200);
}
