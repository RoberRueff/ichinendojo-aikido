(function () {
  "use strict";

  /*
   * Ichinen Dojo — medición GA4 / Google Ads
   *
   * CONFIGURACIÓN:
   * 1. Reemplazar GA4_MEASUREMENT_ID por el ID real de Google Analytics 4 (G-XXXXXXXXXX).
   * 2. En GA4 marcar "whatsapp_click" como evento clave.
   * 3. Vincular GA4 con Google Ads e importar "whatsapp_click" como conversión principal.
   *
   * No se envían nombre, email ni mensaje a Google Analytics.
   */
  var GA4_MEASUREMENT_ID = "";

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  if (!window.gtag) {
    window.gtag = gtag;
  }

  if (GA4_MEASUREMENT_ID) {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_MEASUREMENT_ID);
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID, {
      anonymize_ip: true,
      transport_type: "beacon"
    });
  }

  function trackEvent(name, params) {
    var safeParams = params || {};

    window.dataLayer.push(Object.assign({
      event: name
    }, safeParams));

    if (GA4_MEASUREMENT_ID && typeof window.gtag === "function") {
      window.gtag("event", name, safeParams);
    }
  }

  window.ichinenTrack = trackEvent;

  document.addEventListener("click", function (event) {
    var target = event.target.closest ? event.target.closest("a") : null;
    if (!target) return;

    if (target.classList.contains("js-phone") || target.href.indexOf("tel:") === 0) {
      trackEvent("phone_click", {
        link_location: target.getAttribute("data-analytics-location") || "unknown"
      });
      return;
    }

    if (
      !target.classList.contains("js-cta-whatsapp") &&
      (target.href.indexOf("https://wa.me/") === 0 ||
       target.href.indexOf("https://api.whatsapp.com/") === 0)
    ) {
      trackEvent("whatsapp_click", {
        cta_location: target.getAttribute("data-analytics-location") || "unknown"
      });
      return;
    }

    if (target.classList.contains("js-location-link")) {
      trackEvent("location_click", {
        location_name: target.getAttribute("data-location-name") || "unknown"
      });
    }
  });
})();
