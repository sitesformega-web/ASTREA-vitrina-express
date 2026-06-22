import { CONFIG } from "./config.js";

export async function fetchProducts() {
  const url = `${CONFIG.apiBaseUrl}?action=products`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("No se pudieron cargar los productos.");
  }

  return data.products || [];
}

export async function createOrder(orderData) {
  const url = `${CONFIG.apiBaseUrl}?action=createOrder`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(orderData)
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("No se pudo registrar el pedido.");
  }

  return data;
}