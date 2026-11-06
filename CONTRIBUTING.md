# Guía de Contribución — Almacén CPS Cochabamba

Agradecemos tu interés en contribuir al desarrollo del **Sistema de Gestión, Trazabilidad e Inteligencia de Inventarios** de la Caja Petrolera de Salud (CPS).

---

## 1. Estrategia de Ramas Git

El repositorio opera con el siguiente flujo de ramas:

* **`main`:** Rama de producción. Solo recibe código probado y aprobado mediante Pull Request.
* **`isai`:** Rama de trabajo principal activa de desarrollo y mejoras continuas.
* **`feature/<nombre>`:** Ramas temporales para nuevas funcionalidades (ej: `feature/alerta-temperatura-lotes`).
* **`fix/<nombre>`:** Corrección puntual de errores o bugs.

---

## 2. Convención de Commits

Seguimos el estándar **Conventional Commits**:

| Prefijo | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `feat:` | Nueva funcionalidad | `feat: agregar soporte para lector térmico de códigos QR` |
| `fix:` | Corrección de errores | `fix: resolver redondeo en saldo valorizado de Kardex` |
| `security:` | Mejoras de seguridad o sanitización | `security: sanitizar contraseñas en variables de entorno` |
| `docs:` | Cambios o adiciones en documentación | `docs: agregar diagramas de secuencia FEFO` |
| `refactor:` | Refactorización de código sin alterar comportamiento | `refactor: modularizar middleware de auditoría forense` |
| `test:` | Creación o actualización de pruebas | `test: agregar test unitario para bloqueo FEFO HTTP 403` |

---

## 3. Reglas de Calidad y Seguridad Obligatorias

1. **Nunca subir credenciales reales:** Verifica siempre que tu archivo `.env` esté ignorado antes de hacer `git add`.
2. **Validación FEFO estricta:** Ningún cambio en el motor de despacho debe relajar la verificación sanitaria de fecha de caducidad.
3. **Inmutabilidad del Kardex:** Queda terminantemente prohibido alterar o borrar asientos contables en `movimientos_kardex`.
4. **Respuestas de API estándar:** Todo controlador debe utilizar el formato de envelope `{ success, data, message }`.

---

## 4. Proceso de Pull Request (PR)

1. Crear la rama desde `isai` o `main`:
   ```bash
   git checkout isai
   git pull origin isai
   git checkout -b feature/mi-mejora
   ```
2. Realizar los cambios y asegurar que los servicios arranquen limpiamente.
3. Hacer commit siguiendo los estándares:
   ```bash
   git commit -m "feat: descripción concisa del cambio"
   ```
4. Subir la rama y abrir el Pull Request en GitHub:
   ```bash
   git push -u origin feature/mi-mejora
   ```
