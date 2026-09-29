# Arquitectura Técnica del Sistema (Architecture)

> ⚠️ **Hosting real: Apache en DonWeb (cPanel, `public_html`), no Vercel** (verificado 2026-09-28: cabecera `Server: Apache`). `vercel.json` y `.vercelignore` se borraron porque no aplican. Las cabeceras de seguridad, la caché y las redirecciones se configuran en el `.htaccess` del servidor, y lo que no se debe publicar (`ai/`, `dev/`, `CLAUDE.md`, `README.md`) simplemente no se sube. El repositorio es la fuente única de verdad del código y la configuración versionable.

La arquitectura es **deliberadamente simple**: sitio estático, sin backend, sin base de datos. El único "sistema" externo es WhatsApp, usado como canal de conversión.

> ⚠️ **Estado actual vs objetivo:** el sitio **legacy** (el que se está reemplazando) corre en **WordPress + Elementor + WPForms** (confirmado por la admin bar visible en las capturas: "Editar con Elementor", "WPForms", usuario `Rober Rueff`). El sitio **objetivo** de este documento es un **HTML/CSS/JS estático**, publicado en **Apache/DonWeb (`public_html`)**, sin WordPress, sin PHP, sin MySQL. Ver la brecha y el plan de migración en [`ai/analysis.md`](analysis.md).

## Diagrama de Capas

```text
[ USUARIO / NAVEGADOR ]
         │
         ▼
[ index.html + css/style.css + js/main.js ]   ← estático, sin build, sin framework
         │
         ├── Acordeón FAQ (vanilla JS)
         ├── Carrusel de galería (vanilla JS)
         ├── Menú mobile (vanilla JS)
         └── Formulario "Enviame un mensaje" → arma link wa.me y lo abre
         │
         ▼
[ APACHE / DONWEB (public_html + HTTPS) ]
         │
         ▼
[ WhatsApp (wa.me) ]   ← único destino externo; no hay servidor propio
```

No hay capa de **Middleware/Orquestación**, ni **Motor Cognitivo (IA)**, ni **Persistencia (DB)**: el sitio no recolecta ni almacena datos de nadie. Toda conversión se resuelve en el cliente, redirigiendo a WhatsApp.

## Descripción de Capas

### Capa de Presentación (único componente real)

HTML semántico + CSS (variables de tema: negro `#000`/`#111`, blanco, rojo-naranja de marca `#e8503a` aprox., tipografía condensada en negrita para títulos + sans-serif para texto). Sin frameworks (no React/Vue), sin bundler, sin `node_modules` en producción. Optimizado para LCP bajo: imágenes del hero comprimidas, sin scripts de terceros bloqueantes.

### Capa de Interactividad (`js/main.js`, vanilla)

- **Acordeón FAQ:** togglea `aria-expanded` + altura del panel; sin librerías.
- **Carrusel de galería:** flechas prev/next, sin autoplay agresivo (accesibilidad).
- **Menú mobile:** toggle de clase en el `<nav>`.
- **Conversión → WhatsApp:** cualquier CTA ("Probá una clase gratis", botones de sede, formulario de contacto) arma una URL `https://wa.me/<numero>?text=<mensaje codificado>` y la abre en una pestaña nueva. El formulario de contacto valida los campos (nombre/mensaje no vacíos) antes de armar el link — ver `ai/checks.md`.

### Capa de Hosting (Apache / DonWeb)

Publicación estática copiando únicamente el artefacto público a `public_html`. Apache aplica las reglas de `.htaccess` para headers de seguridad, caché y redirecciones. No hay funciones server-side, build ni variables de entorno. Ver `ai/deploy-checklist.md`.

### Capa de Datos

**No existe.** No hay base de datos, no hay backend que reciba el formulario, no se persiste ningún dato de contacto del visitante. Esto es una decisión de diseño (ver `ai/rules.md` R2), no una limitación pendiente de resolver — a diferencia del patrón de otros proyectos del mismo autor (ej. `agencia-infouno-ia`), acá **no hay roadmap hacia backend/DB**, salvo que el negocio lo pida explícitamente en el futuro.

---

> Referencias: contenido que alimenta esta arquitectura en `ai/taxonomy.md` · reglas de negocio en `ai/rules.md`.
