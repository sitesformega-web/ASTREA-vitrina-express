/**
 * ==========================================================
 * ASTREA™ Vitrina Express
 * Configuration
 * ==========================================================
 *
 * Toda la información específica del comercio
 * debe vivir en este archivo.
 *
 * No colocar lógica.
 * No colocar funciones.
 *
 * Solamente configuración.
 * ==========================================================
 */

const STORE = {

    /**
     * ======================================================
     * Información general
     * ======================================================
     */

    info: {

        name: "ASTREA Market",

        slogan: "Armá tu pedido y retiralo en el local.",

        logo: null,

    },



    /**
     * ======================================================
     * Identidad visual
     * ======================================================
     */

    theme: {

        primary: "#22A745",

        dark: "#168737",

    },



    /**
     * ======================================================
     * Contacto
     * ======================================================
     */

    contact: {

        whatsapp: "595994151453",

        email: "",

    },



    /**
     * ======================================================
     * Horarios
     * ======================================================
     */

    schedule: {

        open: "07:00",

        close: "21:00",

    },



    /**
     * ======================================================
     * Estado operativo
     * ======================================================
     */

    availability: {

        status: "open",

        /*
            open
            closed
            temporary
        */

        message: ""

    },



    /**
     * ======================================================
     * Configuración
     * ======================================================
     */

    settings: {

        currency: "Gs.",

        weightStep: 50,

        maxWeight: 1500,

        rememberCustomer: true,

        enableSearch: true,

        enableCategories: true,

        enableImages: true,

        enableStock: true,

        enableWhatsapp: true,

        enableEmailNotifications: false,

    },



    /**
     * ======================================================
     * API
     * ======================================================
     */

    api: {

        endpoint: "PEGAR_AQUI_TU_EXEC"

    }

};
