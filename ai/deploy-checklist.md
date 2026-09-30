# Deploy Checklist — DonWeb (Apache)

Procedimiento de deploy para un sitio **100% estático** (sin backend, sin build step, sin variables de entorno) en el hosting de **DonWeb** (Apache, carpeta `public_html/`).

> El sitio vive en **DonWeb**. Toda la configuración del servidor está en **`.htaccess`**.
>
> Fuente de verdad técnica: `ai/`. _Creado: 2026-09-20 · reescrito para DonWeb: 2026-09-28._

---

## 0. Qué se sube y qué NO

- **Se sube a `public_html/`:** `index.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, **`.htaccess`**, `css/`, `js/`, `assets/`.
- **NO se sube nunca:** `ai/` (documentación interna), `dev/` (herramientas internas, ej. `dev/responsive-preview.html`), `CLAUDE.md`, `README.md`, `.gitignore`, `.git/`. Si se suben por error, el `.htaccess` les devuelve 404, pero no hay que depender de eso.
- **`.htaccess` es obligatorio:** sin él se pierden la CSP y los headers de seguridad, el caché, la compresión, los tipos MIME de `.webp`/`.woff2` y la redirección a HTTPS. Es un archivo oculto: en el Finder se ve con ⌘⇧. y en FileZilla con *Servidor → Forzar mostrar archivos ocultos*.
- **No hay `.env`, no hay `config.php`, no hay secretos.** El único dato "sensible" (número de WhatsApp) ya está en el HTML/JS a propósito — no es un secreto.

## 1. Subir cambios

1. Subir por el administrador de archivos de DonWeb o por FTP **solo los archivos que cambiaron**, respetando las carpetas (`css/style.css` va dentro de `public_html/css/`, etc.).
2. **Imágenes:** caché de 7 días (`.htaccess`). Si se reemplaza una imagen, **subirla con otro nombre** y actualizar la referencia; con el mismo nombre, los visitantes pueden seguir viendo la vieja.
3. HTML/CSS/JS se revalidan en cada visita (`Cache-Control: no-cache`): los cambios se ven al recargar.

## 2. HTTPS y dominio

- **SSL:** certificado Let's Encrypt activo desde el panel de DonWeb (verificado: `http://` redirige a `https://`). El `.htaccess` fuerza HTTPS; si alguna vez se desactiva el SSL, comentar esas dos líneas o el sitio no carga.
- **HSTS:** comentado en `.htaccess`. Activarlo solo con HTTPS estable (el navegador lo recuerda por un año).
- **Dominio:** `ichinendojo.com.ar`. Si cambia, actualizar `canonical`, `og:url` y `og:image` en `index.html` (URLs absolutas).

## 3. Verificación (no asumir — comprobar)

```bash
D=https://ichinendojo.com.ar
curl -s -o /dev/null -w "index: %{http_code}\n" $D/
curl -s -o /dev/null -w "ai/ (debe ser 404): %{http_code}\n" $D/ai/rules.md
curl -sI $D/ | grep -iE 'content-security-policy|x-frame-options|x-content-type'   # .htaccess activo
curl -sI $D/assets/fonts/inter-variable.woff2 | grep -i cache-control              # debe decir max-age=31536000, immutable
curl -sI http://ichinendojo.com.ar/ | grep -i location                             # redirección a https
curl -s -o /dev/null -w "og-image: %{http_code}\n" $D/assets/img/og-image.jpg
```

Revisar manualmente en el navegador (desktop + mobile ~375px):
- Los botones "Probá una clase gratis..." y "Quiero probar clase gratis" del menú abren WhatsApp con mensaje prellenado.
- Los botones de teléfono de cada sede y los logos de WhatsApp abren WhatsApp con el número correcto.
- El acordeón de FAQ abre/cierra sin saltos de layout; el carrusel funciona con flechas.
- El formulario muestra errores si falta un campo y arma bien el link de WhatsApp.
- **GTM/GA4:** en GA4 → Informes → Tiempo real, un clic en WhatsApp registra `clic_whatsapp`.
- **Vista previa de WhatsApp:** validar con https://developers.facebook.com/tools/debug/ (WhatsApp cachea la preview).

## 4. Contenido pendiente de reemplazo (antes de ir a producción "de verdad")

Ver `ai/guardrails.md` G1 y `ai/taxonomy.md` B.3/B.4 — repasar con el dueño del dojo:

- [x] 6 testimonios (Cynthia, Daniel, Nestor Pace, Gabriel, Ian, Lucía) → aprobados por sus firmantes (2026-09-27), marcados `origen: 'aprobado'`. Verificar que ningún testimonio quede en `origen: 'ejemplo'`.
- [ ] 6 respuestas de FAQ (de 7 preguntas) marcadas `origen: 'redactada'` → confirmar que reflejan cómo funciona el dojo realmente.
- [ ] Links de redes sociales: Instagram ✅ (https://www.instagram.com/aikidoichinendojo/), Facebook ✅ (https://www.facebook.com/ichinendojo); X sigue en `#` → completar con las URLs reales cuando se tengan.
- [ ] Foto del instructor Rober Rueff sigue en placeholder (logo del dojo) → reemplazar si se consigue una foto real.

## 5. Tabla de errores típicos

| Síntoma | Causa | Fix |
|---|---|---|
| Botón de WhatsApp no abre nada | Número mal formateado (con `+` o espacios) en `wa.me/` | Usar `5491159397079`, sin símbolos |
| El sitio se ve sin la foto del hero o con estilos viejos | Caché del navegador con archivos anteriores | Recargar con ⌘⇧R; confirmar que `.htaccess` esté subido (manda `no-cache` a HTML/CSS/JS) |
| Error 500 en todo el sitio | `.htaccess` con un error de sintaxis | Volver a subir el `.htaccess` del repo (probado con Apache 2.4) |
| GTM/GA4 dejan de medir | Se editó el script de GTM del `<head>` y su hash ya no coincide con la CSP | Recalcular el `sha256-…` en `.htaccess` (ver `CLAUDE.md` A7) |
| Formulario abre WhatsApp con `undefined` en el mensaje | Campo sin `encodeURIComponent` o `value` mal leído | Revisar `js/main.js`, ver `ai/guardrails.md` G3 |

---

> Referencias: arquitectura en `ai/architecture.md` · seguridad en `ai/security-audit.md` · checks previos al deploy en `ai/checks.md`.
