import { fetchProducts } from "./api.js";

import {
  state,
  setProducts,
  filterProducts,
  setCategory,
  addUnitProduct,
  addWeightProduct,
  removeCartItem,
  clearCart
} from "./state.js";

import {
  renderStoreName,
  renderCategories,
  renderProducts,
  renderCart
} from "./ui.js";

async function loadProducts() {
  try {

    const products = await fetchProducts();

    setProducts(products);

    renderCategories(handleCategoryChange);

    renderProducts(
      state.filteredProducts,
      handleAddProduct
    );

    renderCart(
      handleRemoveItem,
      handleClearCart
    );

  } catch (error) {

    console.error(error);

    document.getElementById("loader").innerHTML =
      "Error al cargar productos.";

  }
}

function handleCategoryChange(category) {

  setCategory(category);

  filterProducts(
    document.getElementById("searchInput").value
  );

  renderCategories(handleCategoryChange);

  renderProducts(
    state.filteredProducts,
    handleAddProduct
  );
}

function handleSearch(event) {

  filterProducts(event.target.value);

  renderProducts(
    state.filteredProducts,
    handleAddProduct
  );
}

function handleAddProduct(product, value) {

  if (product.tipoVenta === "weight") {

    addWeightProduct(
      product,
      Number(value)
    );

  } else {

    addUnitProduct(
      product,
      Number(value)
    );

  }

  renderCart(
    handleRemoveItem,
    handleClearCart
  );
}

function handleRemoveItem(index) {

  removeCartItem(index);

  renderCart(
    handleRemoveItem,
    handleClearCart
  );
}

function handleClearCart() {

  if (
    !confirm(
      "¿Desea vaciar completamente el pedido?"
    )
  ) {
    return;
  }

  clearCart();

  renderCart(
    handleRemoveItem,
    handleClearCart
  );
}

function init() {

  renderStoreName();

  document
    .getElementById("searchInput")
    .addEventListener(
      "input",
      handleSearch
    );

  loadProducts();
}

init();
