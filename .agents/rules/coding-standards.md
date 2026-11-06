# Estándares de Codificación — Almacén CPS

Directrices técnicas aplicables a los diferentes lenguajes y frameworks del repositorio:

## 1. Backend (Node.js & Express)
* Utilizar sintaxis moderna ECMAScript (ES6+) con funciones asíncronas (`async/await`).
* Toda consulta que modifique múltiples tablas o el stock debe usar transacciones Sequelize explícitas.
* Todas las respuestas de la API deben apegarse al formato envelope estándar:
  ```json
  { "success": true, "data": ..., "message": "..." }
  ```
* En caso de error:
  ```json
  { "success": false, "message": "Descripción amigable", "error": "CODIGO_ERROR" }
  ```

## 2. Frontend Web (React & TailwindCSS)
* Componentes funcionales con Hooks de React (`useState`, `useEffect`, `useContext`, `useMemo`).
* Estilos encapsulados con clases utilitarias de TailwindCSS.
* Manejo de estados de carga (`loading`) y error (`error`) en todas las peticiones a la API.
* Iconografía coherente (`lucide-react`).

## 3. Frontend Mobile (React Native / Expo)
* Enfoque centrado en la usabilidad del operario de almacén en pasillo.
* Tamaños de toque mínimos de 48x48 dp para botones críticos.
* Respuestas claras y visuales ante escaneo de códigos QR.

## 4. Servicio de IA (Python)
* Código tipado con Type Hints (`from typing import Dict, List, Optional`).
* Documentación clara de funciones con docstrings en formato Google/NumPy.
* Manejo adecuado de valores nulos e imputación de series temporales.
