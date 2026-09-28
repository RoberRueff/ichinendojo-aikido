# Deploy Checklist — Vercel

> ⚠️ **Hosting real: Apache en DonWeb (cPanel, `public_html`), no Vercel** (verificado 2026-09-28: cabecera `Server: Apache`). `vercel.json` y `.vercelignore` se borraron porque no aplican. Las cabeceras de seguridad, la caché y las redirecciones se configuran en el `.htaccess` del servidor, y lo que no se debe publicar (`ai/`, `dev/`, `CLAUDE.md`, `README.md`) simplemente no se sube. Las menciones a Vercel en este documento quedan como referencia histórica.

Procedimiento de deploy para un sitio **100% estático** (sin backend, sin build step, sin variables de entorno). Mucho más simple que el deploy de `agencia-infouno-ia` (DonWeb/cPanel + PHP + MySQL): acá no hay `config.php` que crear a mano ni base de datos que armar.

> Fuente de verdad técnica: `ai/`. _Creado: 2026-09-20._

---

## 0. Qué se sube y qué NO

- **Se sube:** `index.html`, `css/`, `js/`, `assets/`, `favicon.ico`, `vercel.json` (headers de seguridad y `Cache-Control`: fuentes 1 año `immutable`, imágenes 7 días. **Si se reemplaza una imagen, cambiarle el nombre**: con el mismo nombre, los visitantes pueden seguir viendo la vieja hasta 7 días).
- **Excluido por `.vercelignore`:** `ai/`, `dev/`, `CLAUDE.md`, `README.md`, `.gitignore` — Vercel sin build sirve toda la raíz, así que sin ese archivo quedarían públicos.
- **NO se sube / no hace falta en producción:** `ai/` (documentación interna), `dev/` (herramientas internas de desarrollo, ej. `dev/responsive-preview.html`), archivos fuente de las capturas del sitio legacy, cualquier borrador.
- **No hay `.env`, no hay `config.php`, no hay secretos.** El único dato "sensible" (número de WhatsApp) ya está hardcodeado en el HTML/JS a propósito — no es un secreto.

---

## 1. Primer deploy (con Vercel CLI)

```bash
# desde la raíz del proyecto
vercel          # deploy de preview, pide login la primera vez
vercel --prod   # deploy de producción
```

Vercel detecta un sitio estático automáticamente (sin `package.json` con build script) y lo sirve tal cual desde la raíz. No hace falta `vercel.json` salvo que se agreguen headers de seguridad opcionales (ver `ai/security-audit.md`).

## 2. Dominio

1. Vercel Dashboard → proyecto → **Settings → Domains**.
2. Agregar `ichinendojo.com.ar` (o el dominio real) y seguir las instrucciones de DNS (registros `A`/`CNAME` según si es dominio raíz o subdominio).
3. Esperar la verificación (puede tardar según el TTL del DNS). HTTPS se emite automáticamente (Let's Encrypt vía Vercel) una vez verificado.

## 3. Verificación (no asumir — comprobar)

```bash
D=https://tudominio.com.ar
curl -s -o /dev/null -w "index: %{http_code}\n" $D/
curl -s -o /dev/null -w "ai/ (debe ser 404): %{http_code}\n" $D/ai/rules.md
curl -I $D/ | grep -i strict-transport-security   # confirma HTTPS/HSTS de Vercel
curl -sI $D/ | grep -iE 'content-security-policy|x-frame-options|x-content-type'   # headers de vercel.json
curl -sI $D/assets/fonts/inter-variable.woff2 | grep -i cache-control              # caché largo de assets
curl -s -o /dev/null -w "og-image: %{http_code}\n" $D/assets/img/og-image.jpg
```

Revisar manualmente en el navegador (desktop + mobile ~375px):
- Los 4 botones "Probá una clase gratis" abren WhatsApp con mensaje prellenado.
- Los botones de teléfono de cada sede abren WhatsApp con el número correcto.
- El acordeón de FAQ abre/cierra sin saltos de layout.
- El carrusel de galería funciona con flechas.
- El formulario de contacto no deja enviar campos vacíos y arma bien el link de WhatsApp.
- **Vista previa de WhatsApp:** si el dominio no es `ichinendojo.com.ar`, actualizar `canonical`, `og:url` y `og:image` en `index.html` (URLs absolutas). Validar con https://developers.facebook.com/tools/debug/ (WhatsApp cachea la preview).

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
| `vercel` sube también `ai/` al dominio público | Falta `.vercelignore` | Agregar `ai/` a `.vercelignore` si no se quiere ni siquiera intentar servirlo (igual da 404 al no estar enlazado, pero es más prolijo) |
| Dominio no verifica HTTPS | DNS mal apuntado o TTL alto | Revisar registros en el panel del dominio, esperar propagación |
| Formulario abre WhatsApp con `undefined` en el mensaje | Campo del formulario sin `encodeURIComponent` o `value` mal leído | Revisar `js/main.js`, ver `ai/guardrails.md` G3 |

---

> Referencias: arquitectura en `ai/architecture.md` · seguridad en `ai/security-audit.md` · checks previos al deploy en `ai/checks.md`.
