# Deploy Checklist — DonWeb / Apache

Procedimiento de deploy para un sitio **100% estático** (sin backend, sin build step, sin variables de entorno). Mucho más simple que el deploy de `agencia-infouno-ia` (DonWeb/cPanel + PHP + MySQL): acá no hay `config.php` que crear a mano ni base de datos que armar.

> Fuente de verdad técnica: `ai/`. _Creado: 2026-09-20._

---

## 0. Qué se publica y qué NO

- **Se publica:** `index.html`, `css/`, `js/`, `assets/`, `favicon.ico` y `.htaccess`.
- **No se publica:** `ai/`, `dev/`, `CLAUDE.md`, `README.md`, archivos de trabajo y borradores.
- **Regla:** copiar únicamente el artefacto público a `public_html`; no copiar el repositorio completo.
- **Caché:** `.htaccess` define la política HTTP de caché. Si se reemplaza un asset conservando el mismo nombre, invalidar caché o versionarlo.
- **No hay `.env`, `config.php` ni secretos.**

## 1. Publicación en DonWeb

1. Actualizar el contenido en GitHub.
2. Copiar únicamente el artefacto público a `public_html` mediante el método de administración disponible en DonWeb.
3. Verificar que `.htaccess` esté en la raíz pública.
4. Comprobar HTTPS y el comportamiento del sitio en producción.


Verificar desde navegador o con herramientas HTTP que la portada responde `200`, HTTPS está activo, los headers definidos en `.htaccess` aparecen y los archivos internos no son accesibles.

Vercel detecta un sitio estático automáticamente (sin `package.json` con build script) y lo sirve tal cual desde la raíz. No hace falta `vercel.json` salvo que se agreguen headers de seguridad opcionales (ver `ai/security-audit.md`).

## 2. Dominio

1. Verificar en DonWeb/cPanel que `ichinendojo.com.ar` apunte al hosting correcto.
2. Confirmar que Apache sirve el dominio por HTTPS.
3. Si se modifica DNS, esperar la propagación correspondiente.

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
- **Vista previa de WhatsApp:** si el dominio no es `ichinendojo.com.ar`, actualizar `canonical`, `og:url` y `og:image` en `index.html` (URLs absolutas). Validar con la herramienta de depuración de Meta (WhatsApp cachea la preview).

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
| `ai/` aparece públicamente | Se publicó el repositorio completo | Publicar solo el artefacto público y mantener reglas defensivas en `.htaccess` |
| Dominio no verifica HTTPS | DNS mal apuntado o TTL alto | Revisar registros en el panel del dominio, esperar propagación |
| Formulario abre WhatsApp con `undefined` en el mensaje | Campo del formulario sin `encodeURIComponent` o `value` mal leído | Revisar `js/main.js`, ver `ai/guardrails.md` G3 |

---

> Referencias: arquitectura en `ai/architecture.md` · seguridad en `ai/security-audit.md` · checks previos al deploy en `ai/checks.md`.
