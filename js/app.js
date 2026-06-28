/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * App
 * ==========================================================
 */

function init() {
  setLoading(true);
  renderApp(getHandlers());
  loadProducts();
}

function getHandlers() {
  return {
    onToggleCart,
    onToggleCategories,
    onToggleCategoryLimit,
    onCategorySelect,
    onAddProduct,
    onRemoveCartItem,
    onSendOrder,
    onFeedbackRating,
    onFeedbackComment,
    onFeedbackSubmit
  };
}

async function loadProducts() {
  try {
    const products = await fetchProducts();

    setProducts(products);
    filterProducts("");

    setLoading(false);

    renderApp(getHandlers());
    bindSearch();
  } catch (error) {
    console.error(error);

    setLoading(false);
    renderApp(getHandlers());

    showToast("No se pudieron cargar los productos.", "error");
  }
}

function bindSearch() {
  const input = document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", event => {
    filterProducts(event.target.value);
    renderProducts(getHandlers());
  });
}

function onToggleCart() {
  setCartOpen(!STATE.ui.cartOpen);
  renderCart(getHandlers());
}

function onToggleCategories() {
  setCategoriesOpen(!STATE.ui.categoriesOpen);
  renderCategories(getHandlers());
}

function onToggleCategoryLimit() {
  setCategoriesShowAll(!STATE.ui.categoriesShowAll);
  renderCategories(getHandlers());
}

function onCategorySelect(category) {
  setCategory(category);
  filterProducts(document.getElementById("searchInput")?.value || "");

  setCategoriesOpen(false);

  renderCategories(getHandlers());
  renderProducts(getHandlers());
}

function onAddProduct(product, value) {
  if (product.tipoVenta === "weight") {
    addWeightProduct(product, value);
  } else {
    addUnitProduct(product, value);
  }

  renderCart(getHandlers());
  renderProducts(getHandlers());
  renderFooter(getHandlers());

  showToast("Producto agregado al pedido.", "success");
}

function onRemoveCartItem(index) {
  removeCartItem(index);

  renderCart(getHandlers());
  renderProducts(getHandlers());
  renderFooter(getHandlers());

  showToast("Producto eliminado del pedido.", "info");
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

  STATE.cart.forEach(item => {
    const quantityText =
      item.tipoVenta === "unit"
        ? item.cantidad + " unidad(es)"
        : item.gramos + " g";

    lines.push(
      "- " +
        item.nombre +
        " | " +
        quantityText +
        " | " +
        BUSINESS.settings.currency +
        " " +
        Number(item.subtotal).toLocaleString()
    );
  });

  lines.push("");
  lines.push(
    "Total estimado: " +
      BUSINESS.settings.currency +
      " " +
      getCartTotal().toLocaleString()
  );

  lines.push("");
  lines.push("Retiro en local.");

  if (BUSINESS.availability.status !== "open") {
    lines.push("");
    lines.push("Nota: pedido realizado fuera del estado abierto del comercio.");
  }

  return encodeURIComponent(lines.join("\n"));
}

async function onSendOrder() {
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const noteInput = document.getElementById("customerNote");

  const customerName = nameInput?.value.trim() || "";
  const customerPhone = phoneInput?.value.trim() || "";
  const note = noteInput?.value.trim() || "";

  if (!STATE.cart.length) {
    showToast("Agregá al menos un producto al pedido.", "error");
    return;
  }

  if (!customerName) {
    showToast("Ingresá tu nombre.", "error");
    nameInput?.focus();
    return;
  }

  if (!customerPhone) {
    showToast("Ingresá tu teléfono.", "error");
    phoneInput?.focus();
    return;
  }

  setSending(true);
  renderCart(getHandlers());

  const orderData = {
    cliente: customerName,
    telefono: customerPhone,
    total: getCartTotal(),
    observacion: note,
    items: STATE.cart.map(item => ({
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

    saveCustomer({
      name: customerName,
      phone: customerPhone
    });

    const message = buildWhatsAppMessage(
      result.orderId,
      customerName,
      customerPhone,
      note
    );

    const whatsappUrl =
      "https://wa.me/" +
      BUSINESS.contact.whatsapp +
      "?text=" +
      message;

    showToast(
      "Pedido registrado. Se abrirá WhatsApp para confirmar el envío.",
      "success"
    );

    window.open(whatsappUrl, "_blank");

    clearCart();

    resetFeedback();

    setSending(false);
    setCartOpen(false);

    renderApp(getHandlers());
    bindSearch();
  } catch (error) {
    console.error(error);

    setSending(false);
    renderCart(getHandlers());

    showToast("No se pudo registrar el pedido. Intentá nuevamente.", "error");
  }
}

function onFeedbackRating(rating) {
  setFeedbackRating(rating);
  setFeedbackSent(false);

  renderFooter(getHandlers());
}

function onFeedbackComment(comment) {
  setFeedbackComment(comment);
}

function onFeedbackSubmit() {
  if (!STATE.feedback.rating) {
    showToast("Seleccioná una calificación.", "error");
    return;
  }

  setFeedbackSent(true);

  renderFooter(getHandlers());

  showToast(
    "Agradecemos tus observaciones, nos ayudan a mejorar.",
    "success"
  );

  setTimeout(() => {
    resetFeedback();
    renderFooter(getHandlers());
  }, 2500);
}

function resetFeedback() {
  STATE.feedback.rating = 0;
  STATE.feedback.comment = "";
  STATE.feedback.sent = false;
}

init();
