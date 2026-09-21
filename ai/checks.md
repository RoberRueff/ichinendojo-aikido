# 🔄 Verificaciones y Validaciones (Checks)

Al no haber backend ni lead scoring, los checks de este proyecto son de **integridad del sitio estático**: que los links funcionen, que el contenido sea consistente y que el sitio se vea bien en mobile (la mayoría del tráfico de un dojo local llega por celular).

---

| Tipo de Check | Momento de ejecución | Acción técnica / validación | Objetivo |
|---|---|---|---|
| **Check de formato WhatsApp** | Antes de cada deploy. | Todo link `wa.me/<numero>` usa el mismo número (`5491159397079`, sin `+` ni espacios) y todo `text=` está `encodeURIComponent()`-eado. | Evita links rotos o mensajes con caracteres corruptos. |
| **Check de validación de formulario** | Al enviar "Enviame un mensaje". | Nombre y mensaje no vacíos antes de armar el link de WhatsApp; si faltan, se marca el campo (`aria-invalid`) sin abrir WhatsApp vacío. | Evita mandar al dueño del dojo mensajes en blanco. |
| **Check de consistencia de contacto** | Antes de cada deploy. | Teléfono/email/direcciones iguales en hero, cronograma, tarjetas de sede y footer (ver `ai/rules.md` R3). Grep manual o script simple sobre `index.html`. | Evita datos de contacto desincronizados. |
| **Check responsive** | Antes de cada deploy. | Revisar en ancho mobile (~375px) y desktop: hero, acordeón, carrusel, tarjetas de sede y testimonios, footer con formulario. | El sitio legacy ya es mobile-first (WordPress+Elementor); no se puede regresar en eso. |
| **Check de accesibilidad básica** | Antes de cada deploy. | Todas las `<img>` con `alt` descriptivo; acordeón FAQ con `aria-expanded`/`aria-controls`; contraste de texto rojo sobre negro/blanco ≥ AA. | Usabilidad mínima, sin auditoría formal WCAG. |
| **Check de links externos** | Antes de cada deploy. | Los íconos de redes sociales (Instagram/Facebook/X) son placeholder `#` a propósito (ver decisión en brainstorming) — no deben quedar rotos apuntando a un dominio inventado. | Evita `href` inventados que parezcan reales. |
| **Check de contenido `ejemplo`/`redactada`** | Antes de un deploy a producción con dominio real. | Revisar `ai/taxonomy.md` B.3/B.4: listar testimonios y respuestas de FAQ con `origen` distinto de `real`. | Que el dueño del dojo sepa qué reemplazar por contenido verídico (ver `ai/guardrails.md` G1). |

---

> Referencias: datos verificados en `ai/taxonomy.md` · guardrails de contenido en `ai/guardrails.md` · procedimiento de deploy en `ai/deploy-checklist.md`.
