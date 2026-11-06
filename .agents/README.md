# Sistema de Personalizaciones y Agentes — Almacén CPS (.agents)

Este directorio contiene las configuraciones nativas para **Google Antigravity** y agentes de codificación autónomos, permitiendo una asistencia hiper-contextualizada y especializada en el ecosistema hospitalario de la Caja Petrolera de Salud (CPS Cochabamba).

---

## Estructura del Directorio `.agents/`

```text
.agents/
├── skills/                     # Habilidades procedimentales y runbooks especializados
│   ├── cps-fefo-engine/        # Auditoría y validación estricta de rotación FEFO/FIFO
│   │   └── SKILL.md
│   ├── cps-ai-forecasting/     # Modelos predictivos Random Forest y fórmulas ROP/SS
│   │   └── SKILL.md
│   ├── cps-database-kardex/    # Esquema relacional MySQL y Kardex inmutable
│   │   └── SKILL.md
│   └── cps-ecosystem-dev/      # Operación de los 5 servicios locales y diagnóstico de puertos
│       └── SKILL.md
├── rules/                      # Reglas de cumplimiento obligatorio por directorio
│   ├── fefo-security-rules.md  # Reglas sanitarias y protección de inmutabilidad
│   └── coding-standards.md     # Estándares de desarrollo (Node, React, Expo, Python)
└── agents/                     # Definición de roles de subagentes especializados
    ├── qa-tester.md            # Pruebas de integración de endpoints y transacciones
    ├── fefo-auditor.md         # Auditoría sanitaria y control de caducidades
    └── ai-mlops-engineer.md    # Ingeniería de machine learning y telemetría en Grafana
```
