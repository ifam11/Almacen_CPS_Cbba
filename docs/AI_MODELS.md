# Modelos de Inteligencia Artificial & MLOps — Almacén CPS

* **Módulo:** Predicción de Demanda y Optimización de Inventarios Hospitalarios
* **Tecnología:** Python 3.10+, Scikit-Learn, Pandas, NumPy
* **Archivos Clave:** `ai_service/predict_demand.py`, `ai_service/ai_demand_service.py`
* **Dataset:** `ai_service/dataset_pedidos_materiales_cps_cochabamba_1_anio.csv`

---

## 1. Justificación y Propósito Sanitario

En entornos hospitalarios como la Caja Petrolera de Salud (CPS), las roturas de stock en insumos críticos (fármacos, reactivos, anestésicos) conllevan riesgos vitales. Por otro lado, el sobre-stock ocasiona mermas monetarias severas debido al vencimiento de lotes.

El servicio de IA resuelve este compromiso mediante:
1. Proyección estocástica de la demanda para los próximos 30, 60 y 90 días.
2. Cálculo adaptativo del **Punto de Reorden ($ROP$)** y **Stock de Seguridad ($SS$)**.
3. Notificación temprana de riesgo de desabastecimiento.

---

## 2. Ingeniería de Características (Feature Engineering)

A partir de los egresos registrados en la tabla `movimientos_kardex`, se reconstruye una serie temporal continua con periodicidad diaria y se generan las siguientes variables predictivas:

| Característica | Definición | Relevancia Clínica |
| :--- | :--- | :--- |
| **`lag_1` a `lag_7`** | Demanda observada en los días $t-1, t-2, \dots, t-7$ | Captura la inercia inmediata de consumo hospitalario |
| **`lag_14`, `lag_30`** | Demanda observada hace 2 y 4 semanas | Captura estacionalidades quincenales y mensuales |
| **`rolling_mean_7`** | Media móvil de 7 días | Filtra fluctuaciones aleatorias y picos de fin de semana |
| **`rolling_std_7`** | Desviación estándar móvil de 7 días | Representa la volatilidad y variabilidad de demanda |
| **`day_of_week`** | Día de la semana (0 = Lunes, 6 = Domingo) | Patrones de cirugías programadas vs emergencias |
| **`is_weekend`** | Indicador binario de sábado/domingo | Disminución de demanda de insumos administrativos |
| **`month`** | Mes del año (1 a 12) | Estacionalidad epidemiológica (enfermedades respiratorias en invierno) |

---

## 3. Modelo Predictivo: Random Forest Regressor

Se seleccionó **Random Forest Regressor** por su robustez ante valores atípicos (*outliers*), su capacidad para modelar relaciones no lineales y su resistencia al sobreajuste (*overfitting*):

* **Hiperparámetros configurados:**
  * `n_estimators`: 150 árboles de decisión
  * `max_depth`: 12 niveles de profundidad
  * `min_samples_split`: 4
  * `min_samples_leaf`: 2
  * `random_state`: 42 (Reproducibilidad determinista)

### Métricas de Evaluación:
* **$R^2$ Score (Coeficiente de Determinación):** Mide el porcentaje de varianza explicada ($R^2 > 0.85$ en insumos de alta rotación).
* **MAE (Mean Absolute Error):** Error medio absoluto en unidades de insumo.
* **RMSE (Root Mean Squared Error):** Penaliza fuertemente desviaciones grandes.

---

## 4. Fórmulas Estocásticas de Inventario Hospitalario

### A. Stock de Seguridad ($SS$)
$$SS = Z \times \sigma_d \times \sqrt{L}$$

Donde:
* $Z$: Coeficiente de la distribución normal estándar. Para un **Nivel de Servicio Hospitalario del 95%**, $Z = 1.645$. (Para terapias intensivas con 99%, $Z = 2.326$).
* $\sigma_d$: Desviación estándar de la demanda diaria estimada por el modelo.
* $L$: Tiempo de entrega del proveedor en días (*Lead Time*).

### B. Punto de Reorden ($ROP$)
$$ROP = (\bar{d} \times L) + SS$$

Donde $\bar{d}$ es la demanda media diaria proyectada para el horizonte evaluado.

---

## 5. Integración con el Backend en Node.js

El servicio `backend/src/modules/ai/ai.service.js` orquesta la invocación:
1. Agrupa el histórico de despachos del insumo desde `movimientos_kardex`.
2. Ejecuta `predict_demand.py` pasando los parámetros en formato JSON vía `stdin`.
3. Captura el resultado JSON de `stdout` e inserta las sugerencias de ROP y SS en la respuesta al frontend web.
