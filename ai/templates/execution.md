# Execution Template — Esqueleto de Trabajo Obligatorio

> Este archivo define el esqueleto de trabajo para **toda la sesión**. Se lee y se sigue antes de arrancar cualquier tarea. El orden es: este `execution.md` primero (define el esqueleto), luego `context-loader.md` dentro del paso de contexto.

---

## 0. Preámbulo

- **Proyecto:** Ichinen Dojo — Aikido Argentina (landing de captación, dos sedes en CABA).
- **Stack objetivo:** HTML/CSS/JS estático, sin build, sin framework, sin backend. Hosting en DonWeb (Apache + `.htaccess`). Conversión exclusiva vía WhatsApp (`wa.me`).
- **Estado:** ver `ai/analysis.md` — a la fecha de creación de este documento, el código todavía no está implementado (solo la documentación de `ai/` y el contenido ya relevado del sitio legacy en WordPress).
- **Idioma de trabajo:** Español (con tildes).
- **Referencia de arquitectura:** ver `ai/architecture.md`.

---

## 1. Fases de Ejecución

### Fase 1 — Contexto
- [ ] Ejecutar el protocolo completo de `ai/context-loader.md` en orden.
- [ ] Leer `ai/analysis.md` para saber si el código ya existe o sigue pendiente.
- [ ] Confirmar que se entiende el objetivo de la tarea antes de tocar código.

### Fase 2 — Planificación
- [ ] Descomponer la tarea en pasos concretos y verificables.
- [ ] Señalar riesgos (fidelidad de contenido, responsive/mobile, seguridad del formulario).
- [ ] Definir el criterio de "hecho" (Definition of Done).

### Fase 3 — Implementación
- [ ] Cambios mínimos y enfocados; respetar el estilo del código existente.
- [ ] Fidelidad al contenido del sitio legacy (`ai/rules.md` R5) salvo pedido explícito de cambio.
- [ ] Sin backend ni persistencia propia (`ai/rules.md` R2) salvo pedido explícito.
- [ ] Sanitizar cualquier dato de usuario antes de volcarlo a una URL o al DOM (`ai/guardrails.md` G3).

### Fase 4 — Verificación
- [ ] Probar el comportamiento real en el navegador (desktop y mobile ~375px), no solo asumir que funciona.
- [ ] Repasar `ai/checks.md` (links de WhatsApp, formulario, consistencia de contacto, accesibilidad).
- [ ] Reportar resultados con evidencia (qué se probó y qué salió).

### Fase 5 — Cierre
- [ ] Resumir qué cambió y por qué.
- [ ] Anotar contenido pendiente de reemplazo (testimonios/FAQ de ejemplo, ver `ai/deploy-checklist.md` § 4) si aplica.
- [ ] No hacer commit/push salvo que el usuario lo pida.

---

## 2. Reglas Transversales

1. **Evidencia antes que afirmaciones.** No declarar "funciona" sin haberlo verificado en el navegador.
2. **Fidelidad de contenido primero.** No inventar ni alterar copy migrado del sitio legacy sin marcarlo (`ai/rules.md` R4).
3. **Seguridad del único vector dinámico.** El formulario de contacto siempre sanitiza antes de armar el link de WhatsApp (`ai/guardrails.md` G3).
4. **Simplicidad.** No agregar backend, build system ni dependencias que no estén pedidas explícitamente — la arquitectura objetivo es estática a propósito (`ai/architecture.md`).
5. **Cambios reversibles.** Antes de borrar o sobrescribir, revisar el destino.

---

## 3. Checklist Rápido (copiar como TODOs al inicio de cada tarea)

- [ ] Leí `execution.md` y ejecuté `context-loader.md`.
- [ ] Entendí el objetivo y la Definition of Done.
- [ ] Plan claro y por pasos.
- [ ] Implementación enfocada.
- [ ] Verificación con evidencia.
- [ ] Cierre y resumen.
