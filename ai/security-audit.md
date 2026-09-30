# Auditoría de Seguridad — Ichinen Dojo

> **Estado:** el sitio todavía **no está implementado** (proyecto en fase de diseño/contenido al momento de escribir este documento, 2026-09-20). Esto no es una auditoría de código desplegado como la de `agencia-infouno-ia/ai/security-audit.md` — es la **guía de riesgos a verificar** en cuanto el sitio esté construido, dada la arquitectura elegida (estático, sin backend). Reejecutar como auditoría real post-implementación.

---

## Veredicto de superficie de ataque (por diseño)

Superficie **mínima**: no hay servidor propio, no hay base de datos, no hay claves de API, no hay login. La mayoría de las categorías OWASP clásicas (SQLi, auth roto, deserialización, SSRF) **no aplican** porque no hay backend que las habilite. Los riesgos reales son de **frontend estático** y de **hosting**.

---

## Riesgos a verificar una vez implementado

### 🟠 A verificar en el código

- **XSS en el formulario de contacto (G3 de `ai/guardrails.md`).** El único punto donde texto de usuario toca el DOM/una URL. Verificar: `encodeURIComponent()` en los 3 campos antes de concatenar en `wa.me/...?text=`; nunca `innerHTML` con el valor crudo del campo.
- **`target="_blank"` sin `rel="noopener noreferrer"`.** Cualquier link que abra WhatsApp o redes sociales en pestaña nueva debe llevar `rel="noopener noreferrer"` (evita *tabnabbing* — la pestaña nueva no puede acceder a `window.opener`).
- **Dependencias de terceros.** Si se suma Google Fonts u otra librería por CDN, verificar que no bloquee el render (async/defer) y, si es posible, usar Subresource Integrity (`integrity=`) en `<script>`/`<link>` externos.
- **Filtración de la carpeta `ai/`.** No subir `ai/` ni `dev/` a DonWeb; además el `.htaccess` les devuelve 404. Verificar con `curl -I https://<dominio>/ai/rules.md` → 404.

### 🟡 Hardening de hosting (DonWeb, Apache)

- **HTTPS:** certificado Let's Encrypt desde el panel de DonWeb; el `.htaccess` redirige `http://` → `https://`. Verificar que no haya *mixed content*.
- **Headers de seguridad:** todos en `.htaccess` (CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`). Apache no los agrega solo: si el `.htaccess` no está subido, el sitio queda sin ellos.

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
| 3 | Confirmar que `ai/` no se sirve públicamente tras el deploy | ✅ No se sube a DonWeb y el `.htaccess` devuelve 404 para `ai/`, `dev/` y docs (verificado en producción) |
| 4 | Headers de seguridad vía `.htaccess` | ✅ CSP sin `unsafe-inline` (el único script inline, el de GTM, va autorizado por hash `sha256-…`), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. Sin COOP desde 2026-09-28: rompía la vista previa de GTM (Tag Assistant). **No agregar estilos/scripts inline ni recursos de terceros sin ajustar la CSP.** |
| 5 | Terceros en runtime | ⚠️ Tipografías self-hosted (sin Google Fonts), pero desde 2026-09-28 **Google Tag Manager** (`GTM-WL8G43D5`) por pedido del usuario. CSP abierta a `*.googletagmanager.com`, GA4 (`*.google-analytics.com`, `analytics.google.com` y `*.analytics.google.com` — el dominio raíz hace falta aparte) y Google Signals (`*.g.doubleclick.net`, `www.google.com`, `www.google.com.ar`), verificado con GA4 `G-PMFMSEBWJ6` sin bloqueos. Tags de otro tipo en GTM (Meta Pixel, Ads, HTML personalizado, variables JS personalizadas) necesitan ampliar la CSP. |

---

> Referencias: vector de riesgo detallado en `ai/guardrails.md` G3/G4 · procedimiento de deploy en `ai/deploy-checklist.md`.
