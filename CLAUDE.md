# CLAUDE.md — Ichinen Dojo · Aikido Argentina

Guía para Claude Code al trabajar en este repositorio. Idioma de trabajo: **español**.

## ⚠️ Protocolo obligatorio (leer antes de cualquier tarea)

Este proyecto define un esqueleto de trabajo en `ai/`. Antes de tocar nada, ejecutar **en orden**:

1. **`ai/templates/execution.md`** — esqueleto de trabajo de la sesión (fases y reglas transversales).
2. **`ai/context-loader.md`** — protocolo de carga de contexto (dentro de la Fase 1).
3. **`ai/analysis.md`** — **leer primero dentro del contexto:** estado real vs objetivo y la brecha pendiente.

Los documentos `ai/` son la **fuente de verdad**. Este archivo solo orienta y enlaza; si hay conflicto, mandan los `ai/`. Al cambiar el comportamiento del sitio, **actualizar el doc `ai/` correspondiente en el mismo cambio** para no reintroducir deriva de documentación.

## Qué es

Landing page de **Ichinen Dojo**, escuela de Aikido con dos sedes en CABA (Agronomía y Villa Pueyrredón). Objetivo único: que la persona pruebe una clase gratis, contactando por **WhatsApp**.

## Stack

- **Objetivo (y único):** HTML/CSS/JS estático, sin build system, sin framework, sin backend, sin base de datos. Deploy en **Vercel**. Toda conversión resuelve en un link `wa.me` (WhatsApp) — ver `ai/architecture.md` y `ai/rules.md`.
- **Reemplaza a:** un sitio legacy en WordPress + Elementor + WPForms (de ahí viene todo el contenido migrado — ver `ai/analysis.md`).
- **Estado actual:** ver `ai/analysis.md` — puede que el código (`index.html`/`css/`/`js/`) todavía no exista si esta guía se lee antes de la Fase 1 de implementación.

## Mapa rápido

| Recurso | Propósito |
|---|---|
| `index.html` | Página única con las 10 secciones ancladas del sitio (hero, FAQ, beneficios, filosofía, cronograma, sedes, testimonios, contacto). Ver `ai/taxonomy.md` A. |
| `css/style.css` | Estilos: paleta negro/blanco/rojo-naranja, tipografía condensada + sans-serif, mobile-first. |
| `js/main.js` | Acordeón FAQ, carrusel de galería, menú mobile, lógica de conversión a WhatsApp (sanitizada — ver `ai/guardrails.md` G3). |
| `assets/img/` | Fotos de acción en B&N, logo del dojo, fotos de instructores/alumnos, `og-image.jpg` (vista previa 1200×630). |
| `assets/fonts/` | Oswald e Inter (woff2 variables, self-hosted: el sitio no llama a Google). |
| `vercel.json` · `.vercelignore` | Headers de seguridad (CSP estricta: nada inline, todo `'self'`) y exclusión de `ai/`, `dev/` y docs del deploy. |
| `ai/` | Documentación: protocolo, análisis, arquitectura, taxonomía, reglas, guardrails, checks, auditoría, deploy. |

Detalle completo del mapa de archivos y del contenido en `ai/context-loader.md` (Paso 3) y `ai/taxonomy.md`.

## Correr en local

Sitio 100% estático, sin dependencias: `python3 -m http.server` desde la raíz, o abrir `index.html` directo en el navegador. No hay build, no hay `npm install`, no hay backend que levantar.

No hay suite de tests automatizada: verificar el comportamiento real (acordeón, carrusel, links de WhatsApp, formulario) en el navegador, desktop y mobile (~375px).

## Reglas y restricciones

- **Fidelidad de contenido:** el sitio replica el legacy en estructura y copy (`ai/rules.md` R5); no agregar secciones nuevas (precios, blog, etc.) sin pedido explícito.
- **Canal único de conversión:** todo CTA/formulario resuelve en WhatsApp, nunca en backend propio (R2). No agregar persistencia de datos del visitante sin pedido explícito y sin pasar por `ai/security-audit.md`.
- **Seguridad:** sanitizar (`encodeURIComponent`) cualquier input de usuario antes de armar el link `wa.me`; nunca `innerHTML` con texto de usuario; `rel="noopener noreferrer"` en todo `target="_blank"`. Detalle en `ai/guardrails.md` G3.
- **Contenido redactado:** 6 testimonios fueron redactados y **aprobados por quienes los firman** (`origen: 'aprobado'`, 2026-09-27); un testimonio nuevo o editado necesita otra vez esa aprobación. 6 respuestas de FAQ (de 7 preguntas) son redactadas (`origen: 'redactada'`) — no presentarlas como verificadas (`ai/guardrails.md` G1, `ai/taxonomy.md` B.3/B.4).
- **Consistencia de contacto:** teléfono, email y direcciones deben coincidir en las 4 secciones donde aparecen (R3).
- **Cambios mínimos y reversibles;** respetar el estilo del código existente. No hacer commit/push salvo que el usuario lo pida.

## 🔎 Auditoría integral — 2026-09-27

Revisión completa de código (`index.html`, `css/style.css`, `js/data.js`, `js/main.js`, `dev/`), assets y de los 10 documentos `ai/`. Verificado: sintaxis JS OK (`node --check`), imágenes sin EXIF/GPS, sin secretos en el repo ni en el historial de git. **Estado: nada de esto está corregido todavía.** Al resolver un ítem, marcarlo acá y actualizar el doc `ai/` correspondiente.

Severidad: 🔴 alta (resolver antes de publicar) · 🟠 media · 🟡 baja / mejora.

### A. Seguridad y privacidad

- ✅ ~~**A1**~~ (resuelto 2026-09-27: `.vercelignore` excluye `ai/`, `dev/`, `CLAUDE.md`, `README.md`, `.gitignore`) — Vercel publicaría la documentación interna. No existe `.vercelignore` ni `vercel.json`. Un deploy estático sin build sirve **toda la raíz**, incluidos `ai/*.md`, `CLAUDE.md`, `README.md` y `dev/responsive-preview.html`. `ai/security-audit.md` y `ai/deploy-checklist.md` suponen que `ai/` va a dar 404 "por no estar en la carpeta de output", y eso es falso. Esos documentos exponen datos internos (usuario de WordPress, estrategia de contenido, que los testimonios son inventados). **Fix:** crear un `.vercelignore` con `ai/`, `dev/`, `CLAUDE.md`, `README.md` y `.gitignore`.
- ✅ ~~**A2**~~ (resuelto 2026-09-27: `vercel.json` con CSP estricta sin `unsafe-inline`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP; los fondos inline se pasaron al CSS; verificado con Playwright sin violaciones de CSP) — Sin headers de seguridad. No hay CSP, `X-Frame-Options`/`frame-ancestors` (clickjacking), `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy`. Se resuelve con un `vercel.json` de pocas líneas. Nota: los `style="background-image:..."` inline de [index.html:37](index.html) y [index.html:105](index.html) obligan a usar `style-src 'unsafe-inline'`, salvo que se muevan al CSS.
- ✅ ~~**A3**~~ (resuelto 2026-09-27: Oswald e Inter variables self-hosted en `assets/fonts/` con `preload`; cero requests a terceros) — Google Fonts es un tercero. Cada visita manda la IP del usuario a Google. Eso contradice G4 ("no hay tracking / no hay terceros") y queda en zona gris frente a la Ley 25.326. **Fix:** self-host de Oswald e Inter en `assets/fonts/`, que además mejora LCP.
- ✅ ~~**A4**~~ (resuelto 2026-09-27: `maxlength` 80/120/1000) — Formulario sin `maxlength`. Con un mensaje muy largo, la URL `wa.me` puede superar los límites prácticos y WhatsApp la trunca o la rechaza. Sugerido: `maxlength` de 80 para nombre, 120 para email y 1000 para mensaje.
- 🟡 **A5 — `dev/responsive-preview.html`** usa `innerHTML` (con datos constantes: OK) y carga en un iframe cualquier URL que escriba quien lo usa (self-XSS con `javascript:`). Solo es riesgo si se publica, lo que lleva de nuevo a A1.
- ✅ ~~**A6**~~ (resuelto 2026-09-27: `.vercel/` agregado) — `.gitignore` incompleto. Falta `.vercel/`, que el CLI de Vercel crea en el primer deploy.
- ✅ **Correcto:** todo el texto dinámico usa `textContent`, `encodeURIComponent` sobre el mensaje completo en `waLink`, `window.open(..., "noopener,noreferrer")`, todos los `target="_blank"` del HTML (Instagram, Facebook y los 2 logos de WhatsApp) llevan `rel="noopener noreferrer"`, no hay `fetch`, no hay persistencia.

### B. Contenido y aspectos legales

- ✅ ~~**B1**~~ (resuelto 2026-09-27: según el usuario, las personas que firman los 6 testimonios redactados los aprobaron; marcados `origen: 'aprobado'`. Conservar los consentimientos por escrito) — Testimonio inventado atribuido a un instructor real. El commit `6fc06c7` renombró "Nestor Fojo" a **"Nestor Pace"** ([js/data.js:172](js/data.js)). Ahora el instructor de 1er. Dan del cronograma "firma" un testimonio de alumno redactado (`origen: 'ejemplo'`). En general, 6 de 7 testimonios son ficticios pero llevan nombre y foto de personas reales. Esto es riesgo de **publicidad engañosa** (Ley 24.240) y de **derecho a la imagen** (art. 53 CCyC, que exige consentimiento). **Antes de publicar:** conseguir textos reales con consentimiento o quitar esos testimonios.
- ✅ ~~**B2**~~ (resuelto 2026-09-27: FAQ indica 1 h en Central y 1 h 30 en La Emiliana) — Contradicción en la duración de las clases. La FAQ dice "Cada clase dura una hora" ([js/data.js:128](js/data.js)), pero La Emiliana tiene clases de **19 a 20.30 hs** (1 h 30) ([js/data.js:95-96](js/data.js)).
- ✅ ~~**B3**~~ (resuelto 2026-09-27: footer y R3 usan +54 9 11 5939-7079) — Teléfono internacional mal formateado. El footer muestra "+54 11 9 5939-7079" ([index.html:183](index.html)) y R3 repite ese formato. Lo correcto para un celular es **+54 9 11 5939-7079**. El número de `wa.me` (`5491159397079`) sí está bien.
- 🟠 **B4 — Beneficios redactados sin documentar.** Los 5 textos de `BENEFICIOS` están marcados `origen: "redactada"`, pero ni G1, ni taxonomy B, ni `deploy-checklist.md` §4 los listan como contenido a reemplazar. Además, `analysis.md` dice "Beneficios ✅ extraído".
- 🟡 **B5 — R3 no se cumple del todo.** El footer solo muestra la sede Central y le falta el "2do. piso". La dirección de La Emiliana aparece únicamente en la tarjeta de sede.
- 🟡 **B6 — Formato de horario inconsistente.** El cronograma dice "19.30 – 20.30 hs" y las sedes "19.30 a 20.30 hs.". La taxonomía documenta "19:30 – 20:30 hs".
- 🟡 **B7 — Copy.** Hay signos de pregunta sin apertura "¿" en h2/nav ("Tenés dudas…?", "Qué beneficios…?", "Lugar donde practicarlo?", "Qué opinan…?"), mientras que la FAQ sí los usa. "Contáctanos" usa tuteo en un sitio en voseo (debería ser "Contactanos"). "Escuela de artes marciales tradicional **japonés**" debería decir "japonesa". El año del copyright está hardcodeado. Varias de estas cosas vienen del legacy (R5): decidir con el dueño.
- 🟡 **B8** (parcial 2026-09-27: Instagram → https://www.instagram.com/aikidoichinendojo/ y Facebook → https://www.facebook.com/ichinendojo, con `target="_blank" rel="noopener noreferrer"`; falta X) — Redes sociales en `href="#"`. Al hacer clic, la página vuelve arriba. Mejor ocultarlas hasta tener las URLs reales.

### C. Bugs y comportamiento

- ✅ ~~**C1**~~ (resuelto 2026-09-27: `max-height: none` al terminar de abrir; verificado sin recorte tras resize) — El acordeón puede recortar texto. `max-height` se fija en px con `scrollHeight` ([js/main.js:142](js/main.js), [js/main.js:158](js/main.js)). El panel que arranca abierto se mide en `DOMContentLoaded`, **antes de que carguen las webfonts**, y no se remide al redimensionar ni al rotar el celular. Si el texto gana líneas, queda cortado. **Fix:** poner `maxHeight = "none"` en `transitionend`.
- 🟠 **C2** (parcial 2026-09-27: los 2 logos de WhatsApp — ícono del footer y botón flotante — ya tienen el link `api.whatsapp.com/send` real en el `href` y funcionan sin JS; faltan los botones de texto) — Todo depende de JS. FAQ, sedes, cronograma, testimonios y galería se renderizan desde `data.js`. Sin JS, o para crawlers que no ejecutan JS y para la vista previa de WhatsApp o Facebook, esas secciones quedan vacías. Además, los CTAs son `href="#"`: sin JS no llevan a ningún lado, y "copiar link" o el clic medio no funcionan. **Fix barato:** poner el `wa.me` real en el `href`, con `target="_blank" rel="noopener noreferrer"`.
- ✅ ~~**C3**~~ (resuelto 2026-09-27: no se resetea al enviar; mensaje de error por campo) — El formulario se resetea aunque el pop-up se bloquee ([js/main.js:313-314](js/main.js)). Si el navegador bloquea `window.open`, la persona pierde lo que escribió. En los submits inválidos no aparece ningún mensaje, solo un borde rojo.
- 🟡 **C4 — Cambio sin commitear en `js/data.js`** (`git diff`): se sacó la coma final y el `;` de `SEDES` y la línea en blanco. Funciona por ASI, pero rompe el estilo del archivo. Parece accidental: revertir o corregir.
- 🟡 **C5 — Datos sin uso o que no coinciden con el esquema.** `INSTRUCTORES[].foto` nunca se renderiza. `SEDES` no tiene los campos `telefono`/`whatsapp` que exige taxonomy B.2. `assets/img/hero-bg.jpg` (96 KB) no se usa en ningún lado.
- 🟡 **C6** — `safeRun` loguea `fn.name`, que queda vacío en las funciones anónimas, así que los errores de FAQ se ven como "Error inicializando :".

### D. Accesibilidad

- ✅ ~~**D1**~~ (resuelto 2026-09-27: nuevo token `--color-accent-strong: #d63119` (4,87:1) para texto/botones sobre claro; `#e8503a` queda para fondos oscuros y decorativo) — Contraste insuficiente. El acento `#e8503a` sobre blanco da **3,72:1** (AA exige 4,5:1 para texto normal). Falla en los triggers del acordeón sobre fondo blanco y en el texto blanco de los botones `.btn--accent` a 0,85rem. `ai/checks.md` exige AA. Sobre negro da 5,07:1 y pasa.
- ✅ ~~**D2**~~ (resuelto 2026-09-27: `<label>` ocultos, `autocomplete`, `aria-invalid`, mensaje por campo con `aria-describedby` y foco en el primer campo con error) — Formulario sin `<label>`. Solo tiene placeholders. No usa `aria-invalid` (que `ai/checks.md` promete) y los errores no se anuncian.
- 🟡 **D3** — Los paneles cerrados del acordeón siguen en el árbol de accesibilidad: faltan `hidden`/`aria-hidden`. Las tabs de Beneficios no tienen `role="tabpanel"`, `aria-controls` ni navegación con flechas.
- 🟡 **D4** — Con el menú mobile cerrado, sus links siguen siendo alcanzables con Tab. Escape no cierra el menú.
- 🟡 **D5** — La sección `#cronograma` no tiene h2 y usa h4, así que salta niveles de encabezado. Las estrellas "★★★★★" se leen como 5 caracteres, sin `aria-label`. Falta `prefers-reduced-motion` para `scroll-behavior: smooth`.

### E. Performance y SEO

- 🟠 **E1** (mitigado 2026-09-27: la FAQ intro usa `hero-bg.jpg` 1280×850; carrusel y Beneficios se muestran a 168 px de alto, sin superar el tamaño real. **Solución de fondo: conseguir los originales en alta** ≥ 600 px de alto) — Imágenes de galería de muy baja resolución. Son de ~300×168 px (parecen recortes de capturas) y se muestran a 220 px de alto en el carrusel, a 220 px en Beneficios y a **325 px** en la FAQ intro ([css/style.css](css/style.css) `.faq-intro__media img`). Se ven pixeladas, sobre todo en pantallas retina.
- ✅ ~~**E2**~~ (resuelto 2026-09-27: fotos en WebP — el logo queda en PNG de 9 KB porque en WebP pesaba más, y `og-image.jpg` queda en JPG por compatibilidad de las previews —; logo 168 px, testimonios 96 px, `width`/`height` en todas las `<img>`, incluida la galería vía `GALERIA[].ancho/alto`) — Assets pesados. `logo.png` pesa 172 KB para mostrarse a 84 px, `hakama-bg.png` pesa 173 KB, `action-hands.jpg` 168 KB. Las `<img>` no tienen `width`/`height` (genera CLS). Conviene pasarlas a WebP y agregar dimensiones.
- 🟡 **E3** (parcial 2026-09-27: Open Graph + Twitter Card + canonical + theme-color con `assets/img/og-image.jpg` 1200×630. **Las URLs asumen `https://ichinendojo.com.ar/`: ajustar si el dominio es otro.** Faltan JSON-LD, robots, sitemap) — Faltan metadatos. No hay Open Graph ni Twitter Card, así que al compartir el link por WhatsApp sale sin preview (y WhatsApp es el canal de conversión). Tampoco hay `canonical`, `theme-color`, JSON-LD `SportsActivityLocation`, `robots.txt` ni `sitemap.xml`.

### F. Documentación desactualizada (deriva)

- 🟠 **F1** — Docs que todavía dicen que el código "**no está implementado**": `ai/templates/execution.md` §0, `ai/context-loader.md` pasos 2 y 3 ("pendiente de crear") y `ai/security-audit.md` (encabezado y roadmap con los ítems 1 y 2 en `PENDIENTE`, cuando `analysis.md` los da por verificados).
- ✅ ~~**F2**~~ (resuelto 2026-09-27) — "Nestor Fojo" sigue en los docs. Aparece en `ai/analysis.md` (§3 y §5.2, donde dice que son "personas distintas"), en `ai/guardrails.md` G1 y en `ai/deploy-checklist.md` §4. El código ya dice Nestor Pace (ver B1).
- 🟡 **F3 — Números que no coinciden.** Taxonomy B.4 dice "las otras **5** redactadas" y el resto de los docs dice 6. `analysis.md` habla de "**8** fotos" de galería y hay 6. `deploy-checklist.md` dice "los **4** botones Probá una clase gratis" y hay 5 estáticos más 2 por sede. Taxonomy B.1 dice que Nestor Pace está "sin foto", pero existe `nestor-pace.jpg`.
- 🟡 **F4 — Mapas incompletos.** El mapa de este CLAUDE.md y la estructura de `README.md` no mencionan `js/data.js` ni `dev/`.

### G. Performance y responsive (revisión 2026-09-27, resuelto)

- ✅ Peso de la página: ~932 KB → **270 KB en mobile** / 327 KB en desktop (medido con Playwright, con las imágenes en WebP).
- ✅ Hero: `preload` con `fetchpriority="high"` y versión `action-hands-800.jpg` para ≤720px (los `media` del preload coinciden con el breakpoint del CSS).
- ✅ `vercel.json`: `Cache-Control` en `/assets/fonts/` (1 año, immutable) y `/assets/img/` (7 días). Al reemplazar una imagen, renombrarla.
- ✅ Responsive: logo visible en mobile (56 px), overlay del hero más oscuro en mobile para legibilidad, el contenido del hero arranca debajo del header fijo, áreas táctiles ≥ 44 px (hamburguesa, tabs, flechas, íconos sociales, links del footer, inputs). Verificado en 320/375/768/1024/1440 sin scroll horizontal.

### Prioridad sugerida antes del deploy

1. A1 (`.vercelignore`) · 2. B1 (testimonios con consentimiento o fuera) · 3. B2/B3 (datos de contacto y horarios) · 4. C1 (acordeón) · 5. A2 (`vercel.json` con headers) · 6. D1/D2 (contraste y labels) · 7. E1/E3 (imágenes y Open Graph) · 8. F1–F4 (poner los docs al día).
