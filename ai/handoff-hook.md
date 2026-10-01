# Handoff entre sesiones (hook SessionStart)

Sirve para seguir el trabajo después de `/clear` sin arrastrar una conversación enorme (que gasta tokens) y sin perder el estado.

## Cómo se usa

1. Con la sesión pesada, pedile a Claude: **"guardá el estado actual en HANDOFF.md"**.
2. Ejecutá `/clear`.
3. La sesión nueva arranca con el contenido de `HANDOFF.md` ya cargado, sin que hagas nada.

Si no existe `HANDOFF.md`, el hook no hace nada y la sesión arranca normal.

## Qué conviene que tenga HANDOFF.md

- Qué se estaba haciendo y por qué.
- Qué quedó hecho y qué falta (ítems de la auditoría de `CLAUDE.md`, por ejemplo "C4 pendiente").
- Archivos tocados y decisiones tomadas.
- Próximo paso concreto.

Mantenelo corto: todo lo que tenga se carga en cada sesión nueva.

## Configuración

Vive en `.claude/settings.json` (versionado con el repo):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear",
        "hooks": [
          {
            "type": "command",
            "shell": "powershell",
            "command": "if (Test-Path \"$env:CLAUDE_PROJECT_DIR/HANDOFF.md\") { Get-Content -Raw -Encoding UTF8 \"$env:CLAUDE_PROJECT_DIR/HANDOFF.md\" }"
          }
        ]
      }
    ]
  }
}
```

- `matcher: "startup|clear"`: se dispara al abrir Claude Code y después de `/clear`. No en `resume` ni `compact`, que ya conservan contexto.
- `"shell": "powershell"`: el hook corre en PowerShell (el shell de esta máquina Windows).
- `Test-Path ... { Get-Content ... }`: la salida se le pasa a Claude como contexto; si el archivo no existe no imprime nada ni da error.
- `-Encoding UTF8`: para que las tildes y la ñ lleguen bien.
- `$env:CLAUDE_PROJECT_DIR`: raíz del proyecto, sin importar desde dónde se lance.

## Notas

- `HANDOFF.md` está en `.gitignore`: es estado de trabajo, no se commitea ni se sube a DonWeb.
- La sintaxis es de PowerShell. En Mac/Linux habría que volver a `cat "$CLAUDE_PROJECT_DIR/HANDOFF.md" 2>/dev/null || true` y sacar la línea `shell`.
- Si se cambia `.claude/settings.json`, puede hacer falta reiniciar la sesión o abrir `/hooks` para que lo tome.
- Cuando el trabajo termina, borrá o vaciá `HANDOFF.md` para no cargar contexto viejo.
- Este hook convive con otros `SessionStart` (por ejemplo los de plugins).
