/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * State
 * ==========================================================
 */

const STATE = {
  products: [],
  filteredProducts: [],
  categories: [],
  activeCategory: "Todas",
  cart: loadCart(),
  customer: loadCustomer(),

  feedback: {
    rating: 0,
    comment: "",
    sent: false
  },

  ui: {
    cartOpen: false,
    categoriesOpen: true,
    categoriesShowAll: false,
    loading: false,
    sending: false
  }
};

function loadCart() {
  try {
    return JSON.parse(
      localStorage.getItem("astrea_vitrina_express_cart") || "[]"
    );
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(
    "astrea_vitrina_express_cart",
    JSON.stringify(STATE.cart)
  );
}

function loadCustomer() {
  try {
    return JSON.parse(
      localStorage.getItem("astrea_vitrina_express_customer") || "{}"
    );
  } catch {
    return {};
  }
}

function saveCustomer(customer) {
  if (!BUSINESS.settings.rememberCustomer) return;

  localStorage.setItem(
    "astrea_vitrina_express_customer",
    JSON.stringify(customer)
  );

  STATE.customer = customer;
}

function setProducts(products) {
  STATE.products = Array.isArray(products) ? products : [];
  STATE.filteredProducts = STATE.products;

  STATE.categories = [
    "Todas",
    ...new Set(
      STATE.products
        .map(product => product.categoria)
        .filter(Boolean)
    )
  ];
}

function filterProducts(search = "") {
  const term = search.toLowerCase().trim();

  STATE.filteredProducts = STATE.products.filter(product => {
    const matchCategory =
      STATE.activeCategory === "Todas" ||
      product.categoria === STATE.activeCategory;

    const matchSearch =
      !term ||
      String(product.nombre || "").toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

  return STATE.filteredProducts;
}

function setCategory(category) {
  STATE.activeCategory = category;
}

function isProductInCart(productId) {
  return STATE.cart.some(item => item.productId === productId);
}

function addUnitProduct(product, quantity = 1) {
  const qty = Number(quantity);
  if (!qty || qty <= 0) return;

  const existing = STATE.cart.find(
    item => item.productId === product.id && item.tipoVenta === "unit"
  );

  if (existing) {
    existing.cantidad += qty;
    existing.subtotal = existing.cantidad * Number(existing.precio);
  } else {
    STATE.cart.push({
      productId: product.id,
      nombre: product.nombre,
      tipoVenta: "unit",
      cantidad: qty,
      gramos: null,
      precio: Number(product.precioUnidad || 0),
      subtotal: qty * Number(product.precioUnidad || 0),
      imagen: product.imagen || ""
    });
  }

  saveCart();
}

function addWeightProduct(product, grams = BUSINESS.settings.minWeight) {
  const selectedGrams = Number(grams);
  if (!selectedGrams || selectedGrams <= 0) return;

  const pricePerKg = Number(product.precioKg || 0);
  const subtotal = (pricePerKg / 1000) * selectedGrams;

  STATE.cart.push({
    productId: product.id,
    nombre: product.nombre,
    tipoVenta: "weight",
    cantidad: null,
    gramos: selectedGrams,
    precio: pricePerKg,
    subtotal,
    imagen: product.imagen || ""
  });

  saveCart();
}

function removeCartItem(index) {
  STATE.cart.splice(index, 1);
  saveCart();
}

function clearCart() {
  STATE.cart = [];
  saveCart();
}

function getCartTotal() {
  return STATE.cart.reduce(
    (total, item) => total + Number(item.subtotal || 0),
    0
  );
}

function getCartCount() {
  return STATE.cart.reduce((count, item) => {
    if (item.tipoVenta === "unit") {
      return count + Number(item.cantidad || 0);
    }

    return count + 1;
  }, 0);
}

function setCartOpen(value) {
  STATE.ui.cartOpen = Boolean(value);
}

function setCategoriesOpen(value) {
  STATE.ui.categoriesOpen = Boolean(value);
}

function setCategoriesShowAll(value) {
  STATE.ui.categoriesShowAll = Boolean(value);
}

function setLoading(value) {
  STATE.ui.loading = Boolean(value);
}

function setSending(value) {
  STATE.ui.sending = Boolean(value);
}

function setFeedbackRating(rating) {
  STATE.feedback.rating = Number(rating);
}

function setFeedbackComment(comment) {
  STATE.feedback.comment = String(comment || "");
}

function setFeedbackSent(value) {
  STATE.feedback.sent = Boolean(value);
}
