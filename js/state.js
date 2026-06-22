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

export function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveCart();
}

export function addUnitProduct(product, quantity = 1) {
  const qty = Number(quantity);

  if (!qty || qty <= 0) return;

  const existing = state.cart.find(
    item =>
      item.productId === product.id &&
      item.tipoVenta === "unit"
  );

  if (existing) {
    existing.cantidad += qty;
    existing.subtotal =
      existing.cantidad * Number(existing.precio);
  } else {
    state.cart.push({
      productId: product.id,
      nombre: product.nombre,
      tipoVenta: "unit",
      cantidad: qty,
      gramos: null,
      precio: Number(product.precioUnidad || 0),
      subtotal: qty * Number(product.precioUnidad || 0)
    });
  }

  saveCart();
}

export function addWeightProduct(product, grams = 100) {
  const selectedGrams = Number(grams);

  if (!selectedGrams || selectedGrams <= 0) return;

  const pricePerKg = Number(product.precioKg || 0);

  const subtotal =
    (pricePerKg / 1000) * selectedGrams;

  state.cart.push({
    productId: product.id,
    nombre: product.nombre,
    tipoVenta: "weight",
    cantidad: null,
    gramos: selectedGrams,
    precio: pricePerKg,
    subtotal
  });

  saveCart();
}

export function getCartTotal() {
  return state.cart.reduce(
    (total, item) => total + Number(item.subtotal || 0),
    0
  );
}
