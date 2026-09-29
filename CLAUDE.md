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

> ⚠️ **Hosting real: Apache en DonWeb (cPanel, `public_html`), no Vercel** (verificado 2026-09-28: cabecera `Server: Apache`). Las cabeceras de seguridad, la caché y las redirecciones se configuran en `.htaccess`. Solo el artefacto público se copia a `public_html`; `ai/`, `dev/`, `CLAUDE.md` y `README.md` no se publican. El repositorio es la fuente única de verdad del código y la configuración versionable.

- **Objetivo (y único):** HTML/CSS/JS estático, sin build system, sin framework, sin backend, sin base de datos. Hosting en **Apache (DonWeb/cPanel)**; en DonWeb. Toda conversión resuelve en un link `wa.me` (WhatsApp) — ver `ai/architecture.md` y `ai/rules.md`.
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
| `.htaccess` (configuración versionada de Apache) | Headers de seguridad, CSP (incluye GTM/GA), caché y redirecciones. El sitio se publica en Apache/DonWeb y las reglas de servidor viven en `.htaccess`. |
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

## 🔎 Estado técnico y pendientes

La auditoría integral original se conserva en el historial de Git. Este documento refleja el estado operativo actual.

### Prioridades actuales

1. Publicar únicamente el artefacto público en DonWeb (`public_html`).
2. Versionar y verificar `.htaccess` para HTTPS, headers de seguridad, caché y protección de archivos internos.
3. Implementar y verificar medición de conversiones de Google Ads/GA4 antes de optimizar campañas.
4. Completar SEO técnico/local: JSON-LD, robots.txt, sitemap.xml y datos de sedes.
5. Mantener actualizados horarios, testimonios, FAQ y enlaces sociales.

### Reglas de mantenimiento

- No agregar dependencias de hosting específicas de otro proveedor.
- No publicar la documentación interna del repositorio.
- No modificar `main` directamente sin autorización explícita; usar ramas y PR para cambios estructurales.
- Ante cualquier cambio de comportamiento del sitio, actualizar la documentación correspondiente en `ai/`.

