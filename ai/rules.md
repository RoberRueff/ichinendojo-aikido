# Reglas de Negocio del Sistema (Rules)

Reglas operativas que gobiernan el contenido y el comportamiento del sitio. Al no haber backend ni IA, son reglas de **contenido y conversión**, no de scoring ni persistencia.

---

## R1 — Regla del CTA Principal

Todo bloque de contenido relevante (hero, FAQ resumen, filosofía, cada sede, cierre) debe ofrecer un botón **"Probá una clase gratis"** visible, sin excepciones — es el único objetivo de conversión del sitio. Ningún bloque nuevo se agrega sin su CTA correspondiente.

## R2 — Regla del Canal Único de Conversión

Toda conversión (CTA, botón de teléfono, formulario de contacto) resuelve en **WhatsApp** (`wa.me`), nunca en un backend propio. No se agrega un formulario que "envíe" datos a un servidor sin que el usuario lo pida explícitamente y sin pasar antes por el `ai/security-audit.md` (implicaría manejo de datos personales, Ley 25.326).

## R3 — Regla de Consistencia de Datos de Contacto

El teléfono (`11 5939-7079` / `+54 11 9 5939-7079`), el email (`info@ichinendojo.com.ar`) y las direcciones de ambas sedes deben ser **idénticos** en todas las secciones donde aparecen (hero/FAQ, cronograma, tarjetas de sede, footer). Si se corrige un dato, se corrige en las cuatro secciones a la vez — ver `ai/checks.md` para la verificación.

## R4 — Regla de Trazabilidad de Contenido No Verificado

Todo contenido que no proviene del sitio legacy (testimonios redactados, respuestas de FAQ redactadas) se marca internamente con `origen: 'ejemplo'` / `'redactada'` en los datos (`ai/taxonomy.md` B.3/B.4). Esto **no se muestra en el HTML público** (no hay etiqueta "ejemplo" visible en la tarjeta), pero permite a cualquier sesión futura saber qué reemplazar por contenido real sin tener que releer todo el sitio. Antes de un deploy a producción con dominio real, revisar `ai/deploy-checklist.md` § "Contenido pendiente de reemplazo".

## R5 — Regla de Fidelidad al Contenido Migrado

La reconstrucción es **fiel** al sitio legacy: mismas secciones, mismo orden, mismo copy (salvo los typos ya corregidos por decisión explícita — ver `ai/guardrails.md` G1). No se agregan secciones nuevas que no existían (ej. no agregar precios, no agregar blog) sin pedido explícito.

---

> Referencias: esquema de contenido en `ai/taxonomy.md` · arquitectura en `ai/architecture.md` · barreras de contenido en `ai/guardrails.md`.
