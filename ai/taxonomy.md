# Taxonomía de Contenidos y Datos (Taxonomy)

Estructura de secciones y datos del sitio de Ichinen Dojo, para que el contenido sea consistente entre el sitio viejo (WordPress + Elementor) y el nuevo (estático) y para que cualquier sesión futura sepa dónde vive cada dato.

---

## A. Estructura de la página (single-page, secciones ancladas)

> **Estado actual:** el sitio legacy (`aikidoichinendojo` en WordPress + Elementor) es una única landing con anclas internas (`#preguntas-frecuentes`, `#beneficios`, `#lugares`, `#contacto`). El sitio nuevo replica el mismo criterio: **una sola página** (`index.html`), sin router ni multi-page, para no perder SEO de una URL única ni complejidad innecesaria.

| Ancla / id | Sección | Contenido |
|---|---|---|
| `#hero` | Hero | "Aikido en CABA", subtítulo (Agronomía y Villa Pueyrredón, sin experiencia previa), CTA "Probá una clase gratis" |
| `#faq-resumen` | Dudas antes de empezar | Acordeón corto (7 preguntas) + imagen + CTA |
| `#beneficios` | Beneficios de practicar Aikido | Tags de beneficios + galería |
| `#filosofia` | Significado y Filosofía | Ai / Ki / Do (kanji) + lista de principios |
| `#cronograma` | Clases en Club Biblioteca Artigas | Tabla de instructores (nombre, grado, día, horario) sobre imagen |
| `#lugares` | Lugares donde practicarlo | 2 tarjetas de sede (Central, La Emiliana) con horario + WhatsApp + CTA |
| `#faq-completo` | Preguntas y Respuestas | Mismo acordeón, versión completa, + CTA |
| `#galeria` | Carrusel de fotos | Carrusel de fotos de acción en B&N |
| `#testimonios` | Qué opinan nuestros alumnos | Tarjetas de testimonios (foto, nombre, estrellas, texto) |
| `#contacto` (footer) | Contactanos / Enviame un mensaje | Datos de contacto + formulario → WhatsApp |

---

## B. Esquema de datos de contenido

> **Estado actual:** no hay backend ni base de datos. Todo el contenido vive en objetos JS estáticos en `js/data.js` (o inline en `main.js`), que alimentan el render de acordeones, tarjetas y carrusel. Si en el futuro se agrega un CMS headless, este esquema es el contrato a preservar.

### B.1 — Instructor (tabla de cronograma)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | `string` | Nombre y apellido. |
| `grado` | `string` | Ej. "2do. Dan". |
| `dia` | `string` | Día de clase que dicta. |
| `horario` | `string` | Ej. "19:30 – 20:30 hs". |
| `foto` | `string \| null` | Ruta a `assets/img/`. `null` → usa el logo del dojo como placeholder. |

Datos reales: Carlos Kostoff (2do. Dan, foto real) · Rober Rueff (4to. Dan, sin foto → placeholder logo) · Nestor Pace (1er. Dan, sin foto).

### B.2 — Sede (`lugares`)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | `string` | Ej. "Ichinen Dojo Central". |
| `direccion` | `string` | Dirección completa con barrio y CABA. |
| `clases` | `{dia: string, horario: string}[]` | Lista de días/horarios. |
| `telefono` | `string` | Formato local (ej. "11 5939-7079"). |
| `whatsapp` | `string` | Formato internacional sin símbolos (ej. "5491159397079"), usado para `wa.me`. |

### B.3 — Testimonio (`testimonios`)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | `string` | Nombre del alumno. |
| `foto` | `string` | Ruta a `assets/img/`. |
| `estrellas` | `number` | 1–5. |
| `texto` | `string` | Cita del testimonio. |
| `origen` | `'real' \| 'ejemplo'` | **Metadato interno, no se muestra en el HTML.** Marca si el testimonio es el real (Carlos Kostoff, migrado del sitio viejo) o un texto de ejemplo redactado a pedir reemplazo (ver `ai/guardrails.md` G1). |

### B.4 — Pregunta frecuente (`faq`)

| Campo | Tipo | Descripción |
|---|---|---|
| `pregunta` | `string` | Texto de la pregunta. |
| `respuesta` | `string` | Texto de la respuesta. |
| `origen` | `'real' \| 'redactada'` | Igual que en testimonios: "Necesito experiencia?" es real (migrada); las otras 5 fueron redactadas por no estar disponibles en el sitio legacy (accordions colapsados sin texto visible en las capturas). |

---

> Referencias: reglas de uso de este contenido en `ai/rules.md` · arquitectura del sitio en `ai/architecture.md`.
