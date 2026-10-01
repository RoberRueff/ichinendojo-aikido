# Context Loader — Protocolo de Carga de Contexto

> Ejecutar este protocolo **completo y en orden** antes de arrancar cualquier tarea en este proyecto. Se invoca dentro de la Fase 1 (Contexto) de `ai/templates/execution.md`, si ese archivo existe en el proyecto.

---

## Paso 1 — Identidad del Proyecto

- **Nombre:** Ichinen Dojo — Aikido Argentina ("Aikido en CABA").
- **Tipo:** Landing page de una escuela de aikido (dos sedes en CABA), sitio estático de captación.
- **Objetivo de negocio:** Conseguir que la persona pruebe una clase gratis, vía WhatsApp. No hay venta online, no hay e-commerce, no hay backend de leads.

## Paso 2 — Arquitectura

> **IMPORTANTE — leer primero `ai/analysis.md`.** El proyecto reemplaza un sitio legacy en WordPress + Elementor por un sitio nuevo estático; a la fecha de este documento, el código del sitio nuevo ya está implementado y verificado localmente.

**Arquitectura objetivo (`ai/architecture.md`):** HTML/CSS/JS estático sin build ni framework, publicado en DonWeb (Apache + `.htaccess`). Sin backend, sin base de datos, sin IA. La única interacción dinámica es client-side (acordeón FAQ, carrusel, menú mobile) y toda conversión redirige a WhatsApp (`wa.me`).

## Paso 3 — Mapa de Archivos

| Recurso | Propósito |
|---|---|
| `index.html` | Página única con las secciones ancladas. |
| `css/style.css` | Estilos del sitio. |
| `js/main.js` | Acordeón, carrusel, menú mobile y conversión a WhatsApp. |
| `assets/img/` | Imágenes del sitio. |
| `ai/analysis.md` | **Estado actual vs objetivo + roadmap (LEER PRIMERO).** |
| `ai/architecture.md` | Arquitectura técnica objetivo. |
| `ai/taxonomy.md` | Estructura de secciones + esquema de datos de contenido (instructores, sedes, testimonios, FAQ). |
| `ai/rules.md` | Reglas de negocio: CTA, canal único de conversión, consistencia de contacto, trazabilidad de contenido no verificado, fidelidad al legacy. |
| `ai/guardrails.md` | Barreras de contenido (testimonios/FAQ de ejemplo) y de seguridad del formulario (sanitización, `noopener`). |
| `ai/checks.md` | Verificaciones antes de cada deploy (links de WhatsApp, formulario, consistencia de contacto, responsive, accesibilidad). |
| `ai/security-audit.md` | Riesgos a verificar una vez implementado (superficie mínima por ser estático). |
| `ai/deploy-checklist.md` | Procedimiento de deploy en DonWeb + checklist de contenido pendiente de reemplazo. |

## Paso 4 — Restricciones y Prioridades

- **Fidelidad de contenido:** el sitio nuevo replica el legacy en estructura y copy (R5 de `ai/rules.md`); no se agregan secciones nuevas sin pedido explícito.
- **Sin backend:** cualquier tentación de agregar un formulario "real" con servidor propio choca con R2 de `ai/rules.md` — requiere decisión explícita del usuario y pasar por `ai/security-audit.md`.
- **Contenido redactado:** 6 testimonios fueron redactados y **aprobados por quienes los firman** (`origen: 'aprobado'`); 6 respuestas de FAQ (de 7 preguntas) son redactadas (`origen: 'redactada'`) — no tratarlas como verificadas (G1 de `ai/guardrails.md`).
- **Idioma:** todo el contenido y las respuestas al usuario van en español (Argentina), con tildes.

## Paso 5 — Checklist de Salida del Loader

- [ ] Entiendo el objetivo de negocio del proyecto (captar alumnos vía WhatsApp).
- [ ] Leí `ai/analysis.md` y sé si el código ya existe o sigue pendiente.
- [ ] Sé qué archivos toca la tarea actual (`index.html` / `css/` / `js/` / `assets/` / `ai/`).
- [ ] Conozco las restricciones (fidelidad al legacy, sin backend, contenido de ejemplo marcado, idioma).
- [ ] Listo para volver a la Fase 2 (Planificación) de `ai/templates/execution.md`, si aplica.
