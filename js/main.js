(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function waLink(mensaje) {
    var texto = encodeURIComponent(mensaje || "Hola! Quería consultar por las clases de Aikido.");
    return "https://wa.me/" + DOJO.telefonoIntl + "?text=" + texto;
  }

  var WA_CLASE_GRATIS = "https://api.whatsapp.com/send/?phone=5491159397079&text=Hola%21+Quer%C3%ADa+consultar+por+las+clases+de+Aikido.&type=phone_number&app_absent=0";

  function openWa(mensaje) {
    var url = waLink(mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /* ---------- Nav mobile ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header flotante sobre el hero ---------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- CTAs -> WhatsApp ---------- */
  function initCtas() {
    document.querySelectorAll(".js-cta-whatsapp").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        openWa(a.getAttribute("data-mensaje"));
      });
    });
  }

  /* ---------- Beneficios (tabs) ---------- */
  function renderBeneficios() {
    var tabs = document.getElementById("beneficiosTabs");
    var panel = document.getElementById("beneficioPanel");
    var foto = document.getElementById("beneficioImg");
    if (!tabs || !panel) return;

    var buttons = [];

    function activar(index) {
      BENEFICIOS.forEach(function (b, i) {
        var isActive = i === index;
        buttons[i].classList.toggle("tag--active", isActive);
        buttons[i].setAttribute("aria-selected", isActive ? "true" : "false");
      });
      panel.textContent = BENEFICIOS[index].texto;

      if (foto && BENEFICIOS[index].foto) {
        foto.classList.add("is-fading");
        window.setTimeout(function () {
          foto.src = BENEFICIOS[index].foto;
          foto.alt = BENEFICIOS[index].titulo;
          foto.classList.remove("is-fading");
        }, 150);
      }
    }

    BENEFICIOS.forEach(function (b, index) {
      var btn = el("button", "tag", b.titulo);
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.addEventListener("click", function () { activar(index); });
      buttons.push(btn);
      tabs.appendChild(btn);
    });

    activar(0);
  }

  /* ---------- Acordeón FAQ ---------- */
  // max-height en px solo existe durante la animación; al terminar de abrir
  // queda en "none", así el panel sigue al contenido si cambia su alto
  // (carga de webfonts, rotación del celular, resize) y nunca recorta texto.
  function renderFaqAccordion(containerId, firstOpen) {
    var container = document.getElementById(containerId);
    if (!container) return;

    FAQ.forEach(function (item, index) {
      var itemEl = el("div", "accordion__item");
      var panelId = containerId + "-panel-" + index;
      var isInitiallyOpen = firstOpen && index === 0;

      var trigger = el("button", "accordion__trigger", item.pregunta);
      trigger.type = "button";
      trigger.setAttribute("aria-expanded", isInitiallyOpen ? "true" : "false");
      trigger.setAttribute("aria-controls", panelId);

      var panel = el("div", "accordion__panel");
      panel.id = panelId;
      panel.setAttribute("data-open", isInitiallyOpen ? "true" : "false");
      if (isInitiallyOpen) panel.style.maxHeight = "none";

      var panelInner = el("div", "accordion__panel-inner");
      if (item.enfasis) {
        var primeraPalabra = item.respuesta.split(" ")[0];
        var resto = item.respuesta.slice(primeraPalabra.length);
        var strong = document.createElement("strong");
        strong.textContent = primeraPalabra;
        panelInner.appendChild(strong);
        panelInner.appendChild(document.createTextNode(resto));
      } else {
        panelInner.textContent = item.respuesta;
      }
      panel.appendChild(panelInner);

      trigger.addEventListener("click", function () {
        var isOpen = panel.getAttribute("data-open") === "true";
        if (isOpen) {
          // De "none" no se puede animar: fijar el alto actual, forzar reflow y cerrar.
          panel.style.maxHeight = panel.scrollHeight + "px";
          void panel.offsetHeight;
          panel.style.maxHeight = "0px";
          panel.setAttribute("data-open", "false");
          trigger.setAttribute("aria-expanded", "false");
        } else {
          panel.style.maxHeight = panelInner.scrollHeight + "px";
          panel.setAttribute("data-open", "true");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      panel.addEventListener("transitionend", function () {
        if (panel.getAttribute("data-open") === "true") panel.style.maxHeight = "none";
      });

      itemEl.appendChild(trigger);
      itemEl.appendChild(panel);
      container.appendChild(itemEl);
    });
  }

  /* ---------- Cronograma ---------- */
  function renderCronograma() {
    var container = document.getElementById("cronogramaTabla");
    if (!container) return;
    INSTRUCTORES.forEach(function (inst) {
      var card = el("div", "cronograma__instructor");
      var h3 = el("h3", null, "");
      h3.textContent = inst.nombre;
      var grado = el("p", null, "");
      grado.textContent = inst.grado;
      var horario = el("p", null, "");
      horario.textContent = inst.horario;
      var dia = el("p", null, "");
      dia.textContent = inst.dia;
      card.appendChild(h3);
      card.appendChild(grado);
      card.appendChild(horario);
      card.appendChild(dia);
      container.appendChild(card);
    });
  }

  /* ---------- Sedes ---------- */
  function renderSedes() {
    var container = document.getElementById("sedesGrid");
    if (!container) return;
    SEDES.forEach(function (sede) {
      var wrap = el("div", "sede");
      var h3 = el("h3", null, "");
      h3.textContent = sede.nombre;
      var dir = el("p", "sede__direccion", "");
      var mapLink = el("a", "js-location-link", sede.direccion);
      mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(sede.direccion + ", Argentina");
      mapLink.target = "_blank";
      mapLink.rel = "noopener noreferrer";
      mapLink.setAttribute("data-location-name", sede.nombre);
      dir.appendChild(mapLink);

      var clasesWrap = el("div", "sede__clases");
      var label = el("p", "sede__clases-label", "Clases días y horas:");
      var list = el("ul");
      sede.clases.forEach(function (c) {
        var li = el("li");
        var diaSpan = document.createElement("span");
        diaSpan.textContent = c.dia;
        var horaSpan = document.createElement("span");
        horaSpan.textContent = c.horario;
        li.appendChild(diaSpan);
        li.appendChild(horaSpan);
        list.appendChild(li);
      });
      clasesWrap.appendChild(label);
      clasesWrap.appendChild(list);

      var telBtn = el("a", "btn btn--outline js-phone", "📞 " + DOJO.telefonoLocal);
      telBtn.href = "tel:+541159397079";
      telBtn.setAttribute("data-analytics-location", "sede-" + sede.id);

      var ctaBtn = el("a", "btn btn--accent", "Probá una clase gratis...");
      ctaBtn.href = WA_CLASE_GRATIS;
      ctaBtn.target = "_blank";
      ctaBtn.rel = "noopener noreferrer";

      wrap.appendChild(h3);
      wrap.appendChild(dir);
      wrap.appendChild(clasesWrap);
      wrap.appendChild(telBtn);
      wrap.appendChild(ctaBtn);
      container.appendChild(wrap);
    });
  }

  /* ---------- Testimonios ---------- */
  function renderTestimonios() {
    var container = document.getElementById("testimoniosGrid");
    if (!container) return;
    TESTIMONIOS.forEach(function (t) {
      var card = el("div", "testimonio");
      var head = el("div", "testimonio__head");
      var nameWrap = el("div");
      var nombre = el("p", "testimonio__nombre", "");
      nombre.textContent = t.nombre;
      var estrellas = el("p", "testimonio__estrellas", "★".repeat(t.estrellas) + "☆".repeat(5 - t.estrellas));
      nameWrap.appendChild(nombre);
      nameWrap.appendChild(estrellas);
      if (t.foto) { // la foto es opcional
        var foto = document.createElement("img");
        foto.className = "testimonio__foto";
        foto.src = t.foto;
        foto.alt = t.nombre;
        foto.loading = "lazy";
        head.appendChild(foto);
      }
      head.appendChild(nameWrap);

      var texto = el("p", "testimonio__texto", "");
      texto.textContent = "“" + t.texto + "”";

      card.appendChild(head);
      card.appendChild(texto);
      container.appendChild(card);
    });
  }

  /* ---------- Galería / carrusel ---------- */
  function initGaleria() {
    var track = document.getElementById("galeriaTrack");
    if (!track) return;
    GALERIA.forEach(function (foto) {
      var img = document.createElement("img");
      img.src = foto.src;
      img.width = foto.ancho;
      img.height = foto.alto;
      img.alt = "Foto de práctica de Aikido en Ichinen Dojo";
      img.loading = "lazy";
      track.appendChild(img);
    });

    var prev = document.getElementById("galeriaPrev");
    var next = document.getElementById("galeriaNext");
    var scrollAmount = function () {
      var first = track.querySelector("img");
      return first ? first.getBoundingClientRect().width + 12 : 220;
    };
    if (prev) prev.addEventListener("click", function () {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }

  /* ---------- Formularios -> WhatsApp (contacto y opinión) ---------- */
  // Valida los campos con errorDe(f) (texto del error o "") y, si todo está bien, arma el mensaje y lo abre en WhatsApp.
  // Los mensajes van en <p id="{campo}Error">, asociados al campo con aria-describedby.
  function initFormWa(form, campos, errorDe, armarTexto, evento) {
    function validar(f) {
      var msg = errorDe(f);
      var p = document.getElementById(f.id + "Error");
      p.textContent = msg;
      p.hidden = !msg;
      if (msg) f.setAttribute("aria-invalid", "true");
      else f.removeAttribute("aria-invalid");
      return !msg;
    }

    campos.forEach(function (f) {
      // Al salir del campo solo se valida si escribió algo (ej. un email mal escrito);
      // no se marca en rojo a quien solo recorre el formulario con Tab.
      f.addEventListener("blur", function () { if (f.type !== "checkbox" && f.value) validar(f); });
      // Si ya tenía error, se revalida al cambiar para que el mensaje desaparezca al corregirlo.
      f.addEventListener("input", function () { if (f.hasAttribute("aria-invalid")) validar(f); });
      f.addEventListener("change", function () { if (f.hasAttribute("aria-invalid")) validar(f); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var invalidos = campos.filter(function (f) { return !validar(f); });
      if (invalidos.length) {
        invalidos[0].focus(); // el lector de pantalla anuncia el campo y su mensaje de error
        return;
      }
      // Evento para GTM/GA4. Sin datos personales: ni nombre, ni email, ni mensaje.
      if (window.dataLayer) window.dataLayer.push({ event: evento });
      // Sin form.reset(): con "noopener" window.open siempre devuelve null y no se
      // puede saber si el navegador bloqueó la ventana; así la persona no pierde lo que escribió.
      openWa(armarTexto());
    });
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var nombre = document.getElementById("cfNombre");
    var email = document.getElementById("cfEmail");
    var mensaje = document.getElementById("cfMensaje");
    var faltante = { cfNombre: "Ingresá tu nombre.", cfEmail: "Ingresá tu email.", cfMensaje: "Escribí tu mensaje." };

    initFormWa(form, [nombre, email, mensaje], function (f) {
      // trim(): un campo con solo espacios no cuenta como completo.
      if (!f.value.trim()) return faltante[f.id];
      if (f === email && !f.validity.valid) return "Revisá el email: tiene que ser del tipo nombre@dominio.com.";
      return "";
    }, function () {
      return "Hola! Soy " + nombre.value.trim() + " (" + email.value.trim() + "). " + mensaje.value.trim();
    }, "envio_formulario");
  }

  // Alta de testimonios: el alumno manda su opinión por WhatsApp; se publica a mano en TESTIMONIOS (js/data.js).
  function initOpinionForm() {
    var form = document.getElementById("opinionForm");
    if (!form) return;
    var nombre = document.getElementById("opNombre");
    var estrellas = document.getElementById("opEstrellas");
    var texto = document.getElementById("opTexto");
    var consentimiento = document.getElementById("opConsentimiento");
    function elegidas() {
      var r = form.querySelector('input[name="estrellas"]:checked');
      return r ? Number(r.value) : 0;
    }

    initFormWa(form, [nombre, estrellas, texto, consentimiento], function (f) {
      if (f === estrellas) return elegidas() ? "" : "Elegí una calificación de 1 a 5.";
      if (f === consentimiento) return f.checked ? "" : "Necesitamos tu autorización para publicarla.";
      if (!f.value.trim()) return f === nombre ? "Ingresá tu nombre." : "Escribí tu opinión.";
      return "";
    }, function () {
      var n = elegidas();
      return "Hola! Soy " + nombre.value.trim() + " y quiero dejar mi opinión sobre Ichinen Dojo para el sitio.\n" +
        "Calificación: " + "★".repeat(n) + "☆".repeat(5 - n) + " (" + n + "/5)\n" +
        "Opinión: " + texto.value.trim() + "\n" +
        "Autorizo publicar mi nombre, mi opinión y, si la mando, mi foto en el sitio.";
    }, "envio_opinion");
  }

  /* ---------- Init ---------- */
  // Cada paso corre aislado: si uno tira una excepción (ej. un dato de
  // contenido mal cargado), no debe impedir que los demás se ejecuten —
  // en particular initCtas(), del que dependen todos los botones de WhatsApp.
  function safeRun(fn) {
    try {
      fn();
    } catch (err) {
      console.error("Error inicializando " + fn.name + ":", err);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    safeRun(initNav);
    safeRun(initHeaderScroll);
    safeRun(renderBeneficios);
    safeRun(function () { renderFaqAccordion("faqAccordionResumen", true); });
    safeRun(function () { renderFaqAccordion("faqAccordionCompleto", false); });
    safeRun(renderCronograma);
    safeRun(renderSedes);
    safeRun(renderTestimonios);
    safeRun(initGaleria);
    safeRun(initContactForm);
    safeRun(initOpinionForm);
    safeRun(initCtas);
  });
})();
