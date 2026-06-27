/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * API
 * ==========================================================
 *
 * Este archivo se encarga únicamente de comunicarse
 * con Google Apps Script.
 * ==========================================================
 */

async function apiRequest(action, options = {}) {
  const url = `${BUSINESS.api.endpoint}?action=${action}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    cache: "no-store",
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Error en la comunicación con ASTREA.");
  }

  return data;
}

async function fetchProducts() {
  const data = await apiRequest("products");

  return data.products || [];
}

async function createOrder(orderData) {
  return await apiRequest("createOrder", {
    method: "POST",
    body: orderData
  });
}

async function fetchReports() {
  return await apiRequest("reports");
}
