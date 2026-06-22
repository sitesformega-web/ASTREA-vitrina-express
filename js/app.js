import { CONFIG } from "./config.js";
import { fetchProducts, createOrder } from "./api.js";

import {
  state,
  setProducts,
  filterProducts,
  setCategory,
  addUnitProduct,
  addWeightProduct,
  removeCartItem,
  clearCart,
  getCartTotal
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
    renderProducts(state.filteredProducts, handleAddProduct);
    renderCart(handleRemoveItem, handleClearCart);

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
  renderProducts(state.filteredProducts, handleAddProduct);
}

function handleSearch(event) {
  filterProducts(event.target.value);
  renderProducts(state.filteredProducts, handleAddProduct);
}

function handleAddProduct(product, value) {
  if (product.tipoVenta === "weight") {
    addWeightProduct(product, Number(value));
  } else {
    addUnitProduct(product, Number(value));
  }

  renderCart(handleRemoveItem, handleClearCart);
}

function handleRemoveItem(index) {
  removeCartItem(index);
  renderCart(handleRemoveItem, handleClearCart);
}

function handleClearCart() {
  if (!state.cart.length) return;

  if (!confirm("¿Desea vaciar completamente el pedido?")) {
    return;
  }

  clearCart();
  renderCart(handleRemoveItem, handleClearCart);
}

function buildWhatsAppMessage(orderId, customerName, customerPhone, note) {
  const lines = [];

  lines.push("Pedido ASTREA Vitrina Express");
  lines.push("");
  lines.push("Pedido: " + orderId);
  lines.push("Cliente: " + customerName);
  lines.push("Teléfono: " + customerPhone);

  if (note) {
    lines.push("Observación: " + note);
  }

  lines.push("");
  lines.push("Productos:");

  state.cart.forEach(item => {
    const quantityText =
      item.tipoVenta === "unit"
        ? item.cantidad + " unidad(es)"
        : item.gramos + " gr";

    lines.push(
      "- " +
        item.nombre +
        " | " +
        quantityText +
        " | Gs. " +
        Number(item.subtotal).toLocaleString()
    );
  });

  lines.push("");
  lines.push(
    "Total estimado: Gs. " +
      getCartTotal().toLocaleString()
  );

  lines.push("");
  lines.push("Retiro en local.");

  return encodeURIComponent(lines.join("\n"));
}

async function handleSendOrder() {
  const customerName =
    document.getElementById("customerName").value.trim();

  const customerPhone =
    document.getElementById("customerPhone").value.trim();

  const note =
    document.getElementById("customerNote").value.trim();

  if (!state.cart.length) {
    alert("Agregá al menos un producto al pedido.");
    return;
  }

  if (!customerName) {
    alert("Ingresá tu nombre.");
    return;
  }

  if (!customerPhone) {
    alert("Ingresá tu teléfono.");
    return;
  }

  const orderData = {
    cliente: customerName,
    telefono: customerPhone,
    total: getCartTotal(),
    observacion: note,
    items: state.cart.map(item => ({
      productoId: item.productId,
      nombre: item.nombre,
      tipoVenta: item.tipoVenta,
      cantidad: item.cantidad || "",
      gramos: item.gramos || "",
      precio: item.precio,
      subtotal: item.subtotal
    }))
  };

  try {
    const result = await createOrder(orderData);

    const message = buildWhatsAppMessage(
      result.orderId,
      customerName,
      customerPhone,
      note
    );

    const whatsappUrl =
      "https://wa.me/" +
      CONFIG.whatsappNumber +
      "?text=" +
      message;

    window.open(whatsappUrl, "_blank");

    clearCart();
    renderCart(handleRemoveItem, handleClearCart);

    alert("Pedido registrado correctamente.");

  } catch (error) {
    console.error(error);
    alert("No se pudo registrar el pedido. Intentá nuevamente.");
  }
}

function init() {
  renderStoreName();

  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);

  document
    .getElementById("sendOrderBtn")
    .addEventListener("click", handleSendOrder);

  loadProducts();
}

init();
