import { fetchProducts } from "./api.js";

import {
  state,
  setProducts,
  filterProducts,
  setCategory,
  addUnitProduct,
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

    renderCart(handleClearCart);

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

function handleAddProduct(product) {

  if (product.tipoVenta === "weight") {

    const grams = prompt(
      "¿Cuántos gramos desea?"
    );

    if (!grams) return;

    const gramsNumber = Number(grams);

    if (isNaN(gramsNumber) || gramsNumber <= 0) {
      alert("Cantidad inválida.");
      return;
    }

    const subtotal =
      (Number(product.precioKg || 0) / 1000) *
      gramsNumber;

    state.cart.push({
      productId: product.id,
      nombre: product.nombre,
      tipoVenta: "weight",
      cantidad: null,
      gramos: gramsNumber,
      precio: Number(product.precioKg || 0),
      subtotal
    });

  } else {

    addUnitProduct(product);

  }

  renderCart(handleClearCart);
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

  renderCart(handleClearCart);
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