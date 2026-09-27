# Análisis del Proyecto — Estado Actual vs Objetivo

> Documento de análisis. Contrasta el **sitio legacy** (el que existía en producción) con el **sitio objetivo** que describen `ai/architecture.md`, `ai/taxonomy.md`, `ai/rules.md` y `ai/guardrails.md`. Fecha de análisis: 2026-09-20.

---

## 1. Resumen Ejecutivo

El sitio ya está **implementado y verificado localmente** (`index.html` + `css/` + `js/` + `assets/img/`). El punto de partida no fue código sino un **sitio legacy en WordPress + Elementor + WPForms** ("Aikido Ichinen Dojo", visible en capturas con la admin bar de WP y usuario `Rober Rueff`), del cual se extrajo el contenido completo (copy, estructura, horarios, direcciones, fotos) para reconstruirlo como **sitio estático HTML/CSS/JS**, sin backend, con conversión exclusiva vía WhatsApp. Falta únicamente el **deploy a Vercel** (`ai/deploy-checklist.md`) y el reemplazo del contenido de ejemplo por contenido real cuando el dueño del dojo lo tenga.

A diferencia de otros proyectos del mismo autor (ej. `agencia-infouno-ia`, que migra *hacia* WordPress+IA+MySQL), acá la migración va en sentido **inverso**: de WordPress hacia un estático simple, porque el sitio no necesita backend, leads persistidos ni IA — es una landing de captación para una escuela de artes marciales con un único objetivo de conversión (agendar una clase de prueba por WhatsApp).

Los documentos `architecture.md`, `taxonomy.md`, `rules.md` y `guardrails.md` describen el **objetivo**. Este archivo registra qué se hizo durante el brainstorming de contenido y qué falta para llegar al objetivo.

---

## 2. Estructura Real del Repositorio (al momento de este análisis)

```text
ichinendojo-aikido/
├── index.html               Página única (10 secciones ancladas)
├── css/style.css             Estilos
├── js/data.js                Contenido (instructores, sedes, FAQ, testimonios, galería)
├── js/main.js                Interactividad (acordeón, carrusel, nav mobile, WhatsApp)
├── assets/img/                Fotos de acción, logo, fotos de instructores/alumnos
├── favicon.ico
├── CLAUDE.md · README.md
└── ai/                       Documentación (9 docs + templates/execution.md)
```

Verificado en local con Playwright (Chromium headless, desktop 1400px y mobile 375px): las 7 preguntas de FAQ, las 2 sedes, los 3 instructores, las 6 fotos de galería y los 7 testimonios renderizan correctamente; el acordeón, el menú mobile y los links de WhatsApp (CTA, botones de sede, formulario) funcionan y arman la URL `wa.me` bien codificada. Sin errores de consola.

---

## 3. Contenido ya relevado (del sitio legacy, vía capturas)

| Bloque | Estado del relevamiento |
|---|---|
| Hero, nav, CTA | ✅ Texto exacto extraído de las capturas en alta resolución. |
| Beneficios de practicar Aikido | ✅ Extraído (con 1 typo corregido: "DICIPLINA" → "DISCIPLINA"). |
| Significado y Filosofía (Ai/Ki/Do) | ✅ Extraído completo, incluye los 7 principios. |
| Cronograma (Club Biblioteca Artigas) | ✅ Extraído: 3 instructores, grados, días, horarios. |
| Lugares donde practicarlo (2 sedes) | ✅ Extraído: direcciones, horarios, teléfono. |
| FAQ — 1 de 7 preguntas con respuesta real | ✅ Completo: solo "Necesito experiencia?" tenía respuesta visible en la captura (accordion abierto). Las otras 6 fueron **redactadas** a pedido del usuario (ver `ai/guardrails.md` G1) e implementadas en `js/data.js`. |
| Testimonios — 1 real + 6 nuevos | ✅ Completo: 1 testimonio real (Carlos Kostoff, migrado tal cual). 6 testimonios **redactados** para alumnos identificados por foto (Cynthia Mizyrycki, Daniel Brgazzi, Nestor Pace, Gabriel Acevedo, Ian Rueff, Lucía Ivorra) — expansión pedida explícitamente por el usuario, no estaba en el sitio legacy — y **aprobados por cada firmante** (2026-09-27, `origen: 'aprobado'`). |
| Footer / contacto | ✅ Extraído: dirección, email, teléfono, redes (sin URLs reales → placeholder `#`). |
| Fotos de acción (galería) | ✅ 8 fotos en B&N ya recibidas y disponibles para usar como asset. |
| Fotos de personas (instructores/alumnos) | ✅ 7 fotos recibidas y mapeadas a nombre + rol (instructor/alumno). Falta foto de un instructor (Rober Rueff) → placeholder logo, decisión ya tomada. |

---

## 4. Matriz de Brechas (Objetivo documentado vs Implementado)

| Área | Objetivo documentado (`ai/architecture.md`) | Estado real | Brecha |
|---|---|---|---|
| **Frontend** | HTML/CSS/JS estático, sin build | ✅ Implementado (`index.html` + `css/style.css`) | — |
| **Contenido** | Fiel al legacy, con testimonios/FAQ ampliados (marcados `origen`) | ✅ Implementado en `js/data.js` | — |
| **Conversión** | Único canal: WhatsApp (`wa.me`), sin backend (R2 de `ai/rules.md`) | ✅ Implementado y verificado (`js/main.js`, `encodeURIComponent` en los 3 vectores: CTA, botones de sede, formulario) | — |
| **Hosting** | Vercel, deploy estático | Sin deploy todavía | Ejecutar `ai/deploy-checklist.md` |
| **Seguridad** | Sanitización del formulario, `rel="noopener"` (`ai/guardrails.md` G3) | ✅ Verificado con Playwright: caracteres especiales (`&`, `<`, `>`) quedan bien codificados en la URL de WhatsApp; `window.open` usa `noopener,noreferrer` | Re-verificar en producción tras el deploy |

---

## 5. Riesgos y Observaciones

1. **Contenido redactado mezclado con contenido real.** Los 6 testimonios redactados ya están aprobados por sus firmantes (2026-09-27). Quedan 6 respuestas de FAQ (de 7 preguntas) redactadas. Mitigado por el marcado `origen` en los datos (`ai/taxonomy.md`) y el checklist previo a producción (`ai/deploy-checklist.md` § 4) — pero requiere que un humano lo revise antes de publicar en el dominio real.
2. ~~**Nombre de instructor con fuente ambigua.**~~ Resuelto: el commit `6fc06c7` corrigió el testimonio a "Nestor Pace" (antes figuraba "Nestor Fojo"), y el testimonio está aprobado por quien lo firma (2026-09-27).
3. **Sin backup del sitio legacy más allá de las capturas.** No se tiene acceso al HTML/CSS fuente de WordPress, solo a capturas de pantalla. Si aparece contenido no capturado (ej. una pregunta de FAQ con matices no visibles), no hay forma de recuperarlo salvo pedirlo al usuario.

---

## 6. Roadmap Sugerido

**Fase 0 — Relevamiento y decisiones de contenido** ✅ completada (este brainstorming)
- ✅ Extracción de copy completo desde las capturas.
- ✅ Decisiones de alcance: fidelidad al legacy, stack estático, WhatsApp como canal único, fotos mapeadas a nombres, typos a corregir.
- ✅ Documentación `ai/` (este set de 9 archivos).

**Fase 1 — Implementación** ✅ completada
- [x] `index.html` con las 10 secciones de `ai/taxonomy.md` A.
- [x] `css/style.css` con la paleta e identidad visual del legacy.
- [x] `js/main.js`: acordeón, carrusel, menú mobile, conversión a WhatsApp (con las sanitizaciones de `ai/guardrails.md` G3).
- [x] `assets/img/`: fotos optimizadas y copiadas (acción + personas + logo + favicon).
- [x] Verificación con Playwright (desktop + mobile, accordion, formulario, WhatsApp links) — sin errores de consola.

**Fase 2 — Deploy** ⏳ pendiente
- [ ] Seguir `ai/deploy-checklist.md` (Vercel, dominio, verificación).

**Fase 3 — Contenido real** ⏳ pendiente (depende del usuario)
- [x] Testimonios redactados aprobados por sus firmantes (`origen: 'aprobado'`, 2026-09-27).
- [ ] Confirmar o reemplazar las respuestas de FAQ `origen: 'redactada'`.
- [ ] Completar links reales de redes sociales.
- [ ] Conseguir foto real del instructor Rober Rueff (opcional).

---

> Referencias: visión en `ai/architecture.md` · datos en `ai/taxonomy.md` · reglas en `ai/rules.md` · seguridad en `ai/guardrails.md` · validaciones en `ai/checks.md`.
