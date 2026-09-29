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
        if (typeof window.ichinenTrack === "function") {
          window.ichinenTrack("whatsapp_click", {
            cta_location: a.getAttribute("data-analytics-location") || "unknown"
          });
        }
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
      var h4 = el("h4", null, "");
      h4.textContent = inst.nombre;
      var grado = el("p", null, "");
      grado.textContent = inst.grado;
      var horario = el("p", null, "");
      horario.textContent = inst.horario;
      var dia = el("p", null, "");
      dia.textContent = inst.dia;
      card.appendChild(h4);
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
      telBtn.href = "tel:+" + DOJO.telefonoIntl;
      telBtn.setAttribute("data-analytics-location", "sede-" + sede.id);

      var ctaBtn = el("a", "btn btn--accent js-cta-whatsapp", "Probá una clase gratis...");
      ctaBtn.href = "#";
      ctaBtn.setAttribute("data-mensaje", "Hola! Quiero probar una clase gratis en " + sede.nombre + ".");

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
      var foto = document.createElement("img");
      foto.className = "testimonio__foto";
      foto.src = t.foto;
      foto.alt = t.nombre;
      foto.loading = "lazy";
      var nameWrap = el("div");
      var nombre = el("p", "testimonio__nombre", "");
      nombre.textContent = t.nombre;
      var estrellas = el("p", "testimonio__estrellas", "★".repeat(t.estrellas) + "☆".repeat(5 - t.estrellas));
      nameWrap.appendChild(nombre);
      nameWrap.appendChild(estrellas);
      head.appendChild(foto);
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

  /* ---------- Formulario de contacto -> WhatsApp ---------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var nombre = document.getElementById("cfNombre");
    var email = document.getElementById("cfEmail");
    var mensaje = document.getElementById("cfMensaje");
    var campos = [nombre, email, mensaje];
    var faltante = { cfNombre: "Ingresá tu nombre.", cfEmail: "Ingresá tu email.", cfMensaje: "Escribí tu mensaje." };

    // Texto del error del campo, o "" si está bien. trim(): un campo con solo espacios no cuenta como completo.
    function errorDe(f) {
      if (!f.value.trim()) return faltante[f.id];
      if (f === email && !f.validity.valid) return "Revisá el email: tiene que ser del tipo nombre@dominio.com.";
      return "";
    }

    // Muestra u oculta el mensaje (asociado al campo con aria-describedby) y marca aria-invalid.
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
      f.addEventListener("blur", function () { if (f.value) validar(f); });
      // Si ya tenía error, se revalida mientras escribe para que el mensaje desaparezca al corregirlo.
      f.addEventListener("input", function () { if (f.hasAttribute("aria-invalid")) validar(f); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var invalidos = campos.filter(function (f) { return !validar(f); });
      if (invalidos.length) {
        invalidos[0].focus(); // el lector de pantalla anuncia el campo y su mensaje de error
        return;
      }

      var texto =
        "Hola! Soy " + nombre.value.trim() +
        " (" + email.value.trim() + "). " +
        mensaje.value.trim();

      if (typeof window.ichinenTrack === "function") {
        window.ichinenTrack("contact_form_submit", {
          form_name: "contact"
        });
      }

      // Sin form.reset(): con "noopener" window.open siempre devuelve null y no se
      // puede saber si el navegador bloqueó la ventana; así la persona no pierde lo que escribió.
      openWa(texto);
    });
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
    safeRun(initCtas);
  });
})();
