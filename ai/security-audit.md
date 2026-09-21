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
- **Filtración de la carpeta `ai/`.** Confirmar que Vercel no sirve `ai/` públicamente (no debería, al no estar en la carpeta de output, pero verificar con `curl -I https://<dominio>/ai/rules.md` tras el deploy → debe dar 404).

### 🟡 Hardening de hosting (Vercel)

- **HTTPS:** automático en Vercel, no requiere configuración. Verificar que no haya *mixed content* (imágenes/scripts servidos por `http://`).
- **Headers de seguridad:** Vercel no agrega CSP/X-Frame-Options por defecto en un sitio estático simple. Si se quiere endurecer, agregar un `vercel.json` con `headers` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`). Opcional para un sitio de este tamaño, pero de bajo costo.
- **Dominio propio:** si se conecta `ichinendojo.com.ar` (u otro) a Vercel, verificar que el registro DNS no quede en un estado intermedio que permita *subdomain takeover* (no debería aplicar mientras el dominio esté activo y apuntando correctamente).

### 🟢 No aplica / fuera de alcance

- SQL Injection, deserialización, auth: no hay backend ni DB.
- Rate-limiting de API: no hay API propia expuesta.
- Ley 25.326 (protección de datos): no se recolectan ni almacenan datos — el formulario solo arma un link de WhatsApp (ver `ai/guardrails.md` G4). Igual conviene un texto breve de privacidad en el footer si en el futuro se agrega cualquier tracking.

---

## Roadmap de remediación

| Prioridad | Acción | Estado |
|---|---|---|
| 1 | Sanitizar (`encodeURIComponent`) los 3 campos del formulario antes de armar el link de WhatsApp | `PENDIENTE` (verificar al implementar) |
| 2 | `rel="noopener noreferrer"` en todos los `target="_blank"` | `PENDIENTE` (verificar al implementar) |
| 3 | Confirmar que `ai/` no se sirve públicamente tras el deploy | `PENDIENTE` (verificar post-deploy) |
| 4 | (Opcional) Headers de seguridad vía `vercel.json` | `PENDIENTE` |

---

> Referencias: vector de riesgo detallado en `ai/guardrails.md` G3/G4 · procedimiento de deploy en `ai/deploy-checklist.md`.
