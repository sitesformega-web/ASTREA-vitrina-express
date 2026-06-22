import { CONFIG } from "./config.js";

export const state = {
  products: [],
  filteredProducts: [],
  categories: [],
  activeCategory: "Todas",
  cart: loadCart()
};

function loadCart() {
  try {
    return JSON.parse(
      localStorage.getItem(CONFIG.storageKey) || "[]"
    );
  } catch {
    return [];
  }
}

export function saveCart() {
  localStorage.setItem(
    CONFIG.storageKey,
    JSON.stringify(state.cart)
  );
}

export function setProducts(products) {
  state.products = products || [];
  state.filteredProducts = products || [];

  state.categories = [
    "Todas",
    ...new Set(
      products
        .map(product => product.categoria)
        .filter(Boolean)
    )
  ];
}

export function filterProducts(search = "") {
  const term = search.toLowerCase().trim();

  state.filteredProducts = state.products.filter(product => {
    const matchCategory =
      state.activeCategory === "Todas" ||
      product.categoria === state.activeCategory;

    const matchSearch =
      !term ||
      String(product.nombre || "")
        .toLowerCase()
        .includes(term);

    return matchCategory && matchSearch;
  });

  return state.filteredProducts;
}

export function setCategory(category) {
  state.activeCategory = category;
}

export function clearCart() {
  state.cart = [];
  saveCart();
}

export function addUnitProduct(product) {
  const existing = state.cart.find(
    item =>
      item.productId === product.id &&
      item.tipoVenta === "unit"
  );

  if (existing) {
    existing.cantidad += 1;
    existing.subtotal =
      existing.cantidad * Number(existing.precio);
  } else {
    state.cart.push({
      productId: product.id,
      nombre: product.nombre,
      tipoVenta: "unit",
      cantidad: 1,
      gramos: null,
      precio: Number(product.precioUnidad || 0),
      subtotal: Number(product.precioUnidad || 0)
    });
  }

  saveCart();
}

export function getCartTotal() {
  return state.cart.reduce(
    (total, item) => total + Number(item.subtotal || 0),
    0
  );
}