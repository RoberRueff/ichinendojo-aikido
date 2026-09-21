# 🛡️ Barreras de Contenido y Seguridad (Guardrails)

Al no haber IA conversacional ni backend, los guardrails de este proyecto son de **integridad de contenido** y de **higiene del único vector dinámico real**: el formulario de contacto que arma un link de WhatsApp.

---

## G1 — Guardrail de Contenido No Verificado

Los 6 testimonios redactados (Cynthia, Daniel, Nestor Fojo, Gabriel, Ian, Lucía) y las 6 respuestas de FAQ redactadas (de 7 preguntas totales) **no son contenido real de alumnos** — fueron generados como placeholder razonable a pedido explícito del dueño del sitio, ante la ausencia del texto real (accordions colapsados / sin testimonios adicionales en el sitio legacy). Quedan marcados con `origen: 'ejemplo'` en los datos (`ai/taxonomy.md`).

- **No** se presentan como citas textuales de una persona real verificada; son ilustrativos hasta que el dueño del dojo los reemplace.
- Antes de cualquier deploy a producción con dominio público real, recordar al usuario (o listar en `ai/deploy-checklist.md`) qué bloques siguen siendo `ejemplo`/`redactada`.
- Los únicos datos 100% reales y migrados: nombres/grados/horarios de instructores, direcciones y horarios de ambas sedes, teléfono, email, y el testimonio de Carlos Kostoff.

## G2 — Guardrail Presupuestario

El sitio **no menciona precios** en ningún bloque (igual que el legacy). Cualquier consulta de costo se resuelve por WhatsApp con una persona real, nunca con un monto fijo en el copy.

## G3 — Guardrail de Sanitización del Único Vector Dinámico

El formulario de contacto toma texto libre del usuario (nombre, email, mensaje) y lo inserta en una URL (`wa.me/...?text=...`). Reglas obligatorias:

- **Siempre** `encodeURIComponent()` sobre cada campo antes de concatenar en la URL — nunca concatenación cruda.
- **Nunca** usar `innerHTML` para reflejar el valor de un campo del formulario en el DOM (ej. un mensaje de confirmación "Gracias, Juan"); usar `textContent`. Evita XSS reflejado aunque el sitio no tenga backend.
- El link de WhatsApp se abre con `window.open(url, '_blank', 'noopener,noreferrer')` — nunca `target="_blank"` sin `rel="noopener noreferrer"` (evita *tabnabbing*).

## G4 — Guardrail de Datos Personales

El sitio **no persiste ningún dato** del visitante (no hay backend, no hay base de datos, no hay `fetch` a servidor propio). Todo lo que el usuario escribe en el formulario viaja directo a WhatsApp (a un número del dojo, no a un tercero) y no queda guardado en ningún lado por el sitio. Si en el futuro se agrega analytics (GA4, Meta Pixel), debe declararse en un aviso de cookies/privacidad — hoy no existe porque no hace falta (no hay tracking).

---

> Referencias: reglas operativas en `ai/rules.md` · superficie de ataque completa en `ai/security-audit.md`.
