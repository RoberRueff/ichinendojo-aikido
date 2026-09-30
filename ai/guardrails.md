# 🛡️ Barreras de Contenido y Seguridad (Guardrails)

Al no haber IA conversacional ni backend, los guardrails de este proyecto son de **integridad de contenido** y de **higiene del único vector dinámico real**: el formulario de contacto que arma un link de WhatsApp.

---

## G1 — Guardrail de Contenido No Verificado

**Testimonios:** 6 de los 7 (Cynthia, Daniel, Nestor Pace, Gabriel, Ian, Lucía) se redactaron como placeholder y **el 2026-09-27 el usuario confirmó que cada persona que los firma los aprobó** (texto, nombre y foto). Quedan marcados `origen: 'aprobado'` en los datos (`ai/taxonomy.md`). Conviene conservar esos consentimientos por escrito (art. 53 CCyC, derecho a la imagen). **Cualquier testimonio nuevo o editado vuelve a necesitar la aprobación de quien lo firma** antes de publicarse.

**FAQ:** 6 de las 7 respuestas (de 7 preguntas totales) **no son contenido migrado**: se redactaron como placeholder razonable a pedido explícito del dueño del sitio, ante la ausencia del texto real (accordions colapsados en el sitio legacy). Quedan marcadas con `origen: 'redactada'`.

- Las respuestas de FAQ `redactada` son ilustrativas hasta que el dueño del dojo las confirme o reemplace.
- Antes de cualquier deploy a producción con dominio público real, recordar al usuario (o listar en `ai/deploy-checklist.md`) qué bloques siguen siendo `redactada`.
- Los únicos datos 100% reales y migrados: nombres/grados/horarios de instructores, direcciones y horarios de ambas sedes, teléfono, email, y el testimonio de Carlos Kostoff. Los otros 6 testimonios no son migrados, pero están aprobados por sus firmantes.

## G2 — Guardrail Presupuestario

El sitio **no menciona precios** en ningún bloque (igual que el legacy). Cualquier consulta de costo se resuelve por WhatsApp con una persona real, nunca con un monto fijo en el copy.

## G3 — Guardrail de Sanitización del Único Vector Dinámico

El formulario de contacto toma texto libre del usuario (nombre, email, mensaje) y lo inserta en una URL (`wa.me/...?text=...`). Reglas obligatorias:

- **Siempre** `encodeURIComponent()` sobre cada campo antes de concatenar en la URL — nunca concatenación cruda.
- **Nunca** usar `innerHTML` para reflejar el valor de un campo del formulario en el DOM (ej. un mensaje de confirmación "Gracias, Juan"); usar `textContent`. Evita XSS reflejado aunque el sitio no tenga backend.
- El link de WhatsApp se abre con `window.open(url, '_blank', 'noopener,noreferrer')` — nunca `target="_blank"` sin `rel="noopener noreferrer"` (evita *tabnabbing*).

## G4 — Guardrail de Datos Personales

El sitio **no persiste ningún dato** del visitante (no hay backend, no hay base de datos, no hay `fetch` a servidor propio). Todo lo que el usuario escribe en el formulario viaja directo a WhatsApp (a un número del dojo, no a un tercero) y no queda guardado en ningún lado por el sitio. **Desde 2026-09-28 el sitio carga Google Tag Manager (`GTM-WL8G43D5`)** por pedido del usuario: cada visita envía datos (IP, navegador, páginas) a Google y, según los tags que se publiquen en el contenedor, cookies de analytics. **Pendiente: aviso de privacidad/cookies** (Ley 25.326) que lo declare — no hay todavía. Los eventos que el sitio manda (`clic_whatsapp`, `envio_formulario`) **nunca incluyen nombre, email ni mensaje** del formulario: mantenerlo así.

---

> Referencias: reglas operativas en `ai/rules.md` · superficie de ataque completa en `ai/security-audit.md`.
