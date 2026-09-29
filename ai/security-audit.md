# Auditoría de Seguridad — Ichinen Dojo

> **Estado:** auditoría del sitio estático implementado. Los controles frontend fueron verificados previamente; esta fase contempla el hardening de Apache y la verificación post-publicación.

---

## Veredicto de superficie de ataque (por diseño)

Superficie **mínima**: no hay servidor propio, no hay base de datos, no hay claves de API, no hay login. La mayoría de las categorías OWASP clásicas (SQLi, auth roto, deserialización, SSRF) **no aplican** porque no hay backend que las habilite. Los riesgos reales son de **frontend estático** y de **hosting**.

---

## Riesgos a verificar una vez implementado

### 🟠 A verificar en el código

- **XSS en el formulario de contacto (G3 de `ai/guardrails.md`).** El único punto donde texto de usuario toca el DOM/una URL. Verificar: `encodeURIComponent()` en los 3 campos antes de concatenar en `wa.me/...?text=`; nunca `innerHTML` con el valor crudo del campo.
- **`target="_blank"` sin `rel="noopener noreferrer"`.** Cualquier link que abra WhatsApp o redes sociales en pestaña nueva debe llevar `rel="noopener noreferrer"` (evita *tabnabbing* — la pestaña nueva no puede acceder a `window.opener`).
- **Dependencias de terceros.** Si se suma Google Fonts u otra librería por CDN, verificar que no bloquee el render (async/defer) y, si es posible, usar Subresource Integrity (`integrity=`) en `<script>`/`<link>` externos.
- **Filtración de la carpeta `ai/`.** Confirmar que Apache/DonWeb no sirve `ai/` públicamente (no debería, al no estar en la carpeta de output, pero verificar con `curl -I https://<dominio>/ai/rules.md` tras el deploy → debe dar 404).

### 🟡 Hardening de hosting (Apache/DonWeb)

- **HTTPS:** automático en Apache/DonWeb, no requiere configuración. Verificar que no haya *mixed content* (imágenes/scripts servidos por `http://`).
- **Headers de seguridad:** Apache/DonWeb no agrega CSP/X-Frame-Options por defecto en un sitio estático simple. Si se quiere endurecer, agregar un ``.htaccess`` con `headers` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`). Opcional para un sitio de este tamaño, pero de bajo costo.
- **Dominio propio:** si se conecta `ichinendojo.com.ar` (u otro) a Apache/DonWeb, verificar que el registro DNS no quede en un estado intermedio que permita *subdomain takeover* (no debería aplicar mientras el dominio esté activo y apuntando correctamente).

### 🟢 No aplica / fuera de alcance

- SQL Injection, deserialización, auth: no hay backend ni DB.
- Rate-limiting de API: no hay API propia expuesta.
- Ley 25.326 (protección de datos): no se recolectan ni almacenan datos — el formulario solo arma un link de WhatsApp (ver `ai/guardrails.md` G4). Igual conviene un texto breve de privacidad en el footer si en el futuro se agrega cualquier tracking.

---

## Roadmap de remediación

| Prioridad | Acción | Estado |
|---|---|---|
| 1 | Sanitizar (`encodeURIComponent`) los 3 campos del formulario antes de armar el link de WhatsApp | ✅ Verificado (Playwright, 2026-09-27) |
| 2 | `rel="noopener noreferrer"` en todos los `target="_blank"` | ✅ `window.open(..., "noopener,noreferrer")`, sin `target="_blank"` en el HTML |
| 3 | Confirmar que `ai/` no se sirve públicamente tras el deploy | ✅ disciplina de publicación lo excluye (Apache/DonWeb sin build sirve **toda** la raíz). Verificar post-deploy con `curl` → 404 |
| 4 | Headers de seguridad vía ``.htaccess`` | ✅ CSP `'self'` sin `unsafe-inline`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP. **No agregar estilos/scripts inline ni recursos de terceros sin ajustar la CSP.** |
| 5 | Sin terceros en runtime | ✅ Tipografías self-hosted en `assets/fonts/` (antes Google Fonts) |

---

> Referencias: vector de riesgo detallado en `ai/guardrails.md` G3/G4 · procedimiento de deploy en `ai/deploy-checklist.md`.
