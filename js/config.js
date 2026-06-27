/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * Business Configuration
 * ==========================================================
 *
 * Este archivo describe el comercio.
 * No contiene lógica.
 * No contiene funciones.
 * Solo configuración.
 * ==========================================================
 */

const BUSINESS = {
  info: {
    name: "ASTREA Market",
    slogan: "Armá tu pedido y retiralo en el local.",
    logo: null
  },

  theme: {
    primary: "#22A745",
    primaryDark: "#168737",
    primarySoft: "#EAF8EE",
    background: "#F5F6F4",
    surface: "#FFFFFF",
    text: "#1F2933"
  },

  contact: {
    whatsapp: "595994151453",
    email: ""
  },

  schedule: {
    open: "07:00",
    close: "21:00"
  },

  availability: {
    status: "open",
    reason: "",
    updatedAt: ""
  },

  settings: {
    currency: "Gs.",
    weightStep: 50,
    minWeight: 50,
    maxWeight: 1500,
    rememberCustomer: true,
    enableSearch: true,
    enableCategories: true,
    enableImages: true,
    enableStock: true,
    enableWhatsapp: true,
    enableEmailNotifications: false
  },

  api: {
    endpoint: "https://script.google.com/macros/s/AKfycbzvkMSG84918hb3wsJEkrkmIH5ev1ZbqZqoHdVzNcBCMILaF52ypMdzmbtYtheBN8ga/exec"
  }
};
