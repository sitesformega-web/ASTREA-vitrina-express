import { state, getCartTotal } from "./state.js";

export function renderStoreName() {
  const el = document.getElementById("storeName");

  if (el) {
    el.textContent = "ASTREA Vitrina Express";
  }
}

export function renderCategories(onSelect) {
  const container = document.getElementById("categoryList");
  container.innerHTML = "";

  state.categories.forEach(category => {
    const button = document.createElement("button");

    button.className =
      "category-btn" +
      (category === state.activeCategory ? " active" : "");

    button.textContent = category;

    button.addEventListener("click", () => {
      onSelect(category);
    });

    container.appendChild(button);
  });
}

export function renderProducts(products, onAddProduct) {
  const grid = document.getElementById("productsGrid");
  const loader = document.getElementById("loader");

  loader.style.display = "none";
  grid.innerHTML = "";

  if (!products.length) {
    grid.innerHTML = `
      <div class="panel">
        No se encontraron productos.
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image =
      product.imagen ||
      "https://placehold.co/500x500?text=Producto";

    const isWeight = product.tipoVenta === "weight";

    const priceText = isWeight
      ? `Gs. ${Number(product.precioKg || 0).toLocaleString()} / Kg`
      : `Gs. ${Number(product.precioUnidad || 0).toLocaleString()}`;

    card.innerHTML = `
      <div class="product-image">
        <img src="${image}" alt="${product.nombre}">
      </div>

      <div class="product-content">
        <div class="product-category">
          ${product.categoria || "General"}
        </div>

        <div class="product-title">
          ${product.nombre}
        </div>

        <div class="product-price">
          ${priceText}
        </div>

        <div class="product-selector">
          ${
            isWeight
              ? `
                <label>Gramos</label>
                <select class="product-input">
                  <option value="100">100 g</option>
                  <option value="250" selected>250 g</option>
                  <option value="500">500 g</option>
                  <option value="750">750 g</option>
                  <option value="1000">1 kg</option>
                </select>
              `
              : `
                <label>Cantidad</label>
                <input class="product-input" type="number" min="1" value="1">
              `
          }
        </div>

        <div class="product-actions">
          <button class="btn btn-primary add-btn">
            Agregar
          </button>
        </div>
      </div>
    `;

    card
      .querySelector(".add-btn")
      .addEventListener("click", () => {
        const value = card.querySelector(".product-input").value;
        onAddProduct(product, value);
      });

    grid.appendChild(card);
  });
}

export function renderCart(onRemoveItem, onClear) {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  container.innerHTML = "";

  if (!state.cart.length) {
    container.innerHTML = `
      <div class="cart-item">
        No hay productos agregados.
      </div>
    `;
  }

  state.cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div>
        <strong>${item.nombre}</strong>

        <div>
          ${
            item.tipoVenta === "unit"
              ? item.cantidad + " unidad(es)"
              : item.gramos + " gr"
          }
        </div>

        <div>
          Gs. ${Number(item.subtotal).toLocaleString()}
        </div>
      </div>

      <button class="remove-item-btn" type="button">
        Quitar
      </button>
    `;

    row
      .querySelector(".remove-item-btn")
      .addEventListener("click", () => {
        onRemoveItem(index);
      });

    container.appendChild(row);
  });

  totalElement.textContent =
    "Gs. " + getCartTotal().toLocaleString();

  const clearButton = document.getElementById("clearCartBtn");
  clearButton.onclick = onClear;
}
