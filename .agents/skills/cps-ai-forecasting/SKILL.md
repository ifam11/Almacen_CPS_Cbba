---
name: cps-ai-forecasting
description: >-
  Entrena, calibra y ejecuta los modelos de Inteligencia Artificial de predicción de demanda
  hospitalaria (Random Forest) y cálculo estocástico de Punto de Reorden (ROP) y Stock de Seguridad (SS)
  para el Almacén CPS. Úsalo al trabajar con scripts de machine learning o el módulo predictivo en Node.js.
---

# Habilidad: Inteligencia Artificial y Predicción de Demanda — Almacén CPS

Esta habilidad documenta la arquitectura de Machine Learning, generación de variables rezagadas (*Lag Features*), entrenamiento de Random Forest Regressor y fórmulas de cálculo de inventarios óptimos en la Caja Petrolera de Salud (CPS).

---

## 1. Arquitectura del Servicio de IA

* **Lenguaje:** Python 3.10+
* **Ubicación:** `ai_service/`
* **Orquestador en Backend:** `backend/src/modules/ai/ai.service.js` (comunicación mediante ejecución de procesos hijos o microservicio REST).
* **Dataset Histórico:** `ai_service/dataset_pedidos_materiales_cps_cochabamba_1_anio.csv` (historial real de pedidos hospitalarios de Cochabamba).

---

## 2. Pipeline de Modelado Predictivo

### A. Ingeniería de Características (Feature Engineering)
Para cada insumo médico se construyen variables dinámicas de series temporales:
1. **Lags Temporales ($t-1 \dots t-7$):** Demanda en los días/semanas anteriores.
2. **Medias Móviles (Rolling Means):** Promedio móvil de 7 y 30 días para suavizar picos esporádicos.
3. **Desviación Estándar Móvil ($\sigma_{rolling}$):** Medida de volatilidad de consumo hospitalario.
4. **Factores Estacionales:** Día de la semana, mes, y si corresponde a fin de mes o feriados.

### B. Algoritmo Random Forest Regressor
* `n_estimators = 150`
* `max_depth = 12`
* `random_state = 42`
* **Métricas de Evaluación:** RMSE (Root Mean Squared Error), MAE (Mean Absolute Error) y $R^2$ Score.

---

## 3. Formulación Estocástica de Inventario

El modelo no solo proyecta la demanda mensual, sino que calcula las políticas de reorden médico:

### A. Punto de Reorden ($ROP$)
$$ROP = (\bar{d} \times L) + SS$$

Donde:
* $\bar{d}$: Demanda media proyectada diaria por el modelo.
* $L$: Tiempo de entrega del proveedor en días (*Lead Time*).
* $SS$: Stock de Seguridad.

### B. Stock de Seguridad ($SS$) con Nivel de Servicio Hospitalario
$$SS = Z \times \sigma_d \times \sqrt{L}$$

Donde:
* $Z$: Coeficiente de distribución normal (para un **95% de nivel de servicio**, $Z = 1.645$).
* $\sigma_d$: Desviación estándar de la demanda diaria.
* $\sqrt{L}$: Factor de raíz cuadrada del tiempo de entrega.

---

## 4. Ejecución y Pruebas

Para ejecutar el pipeline predictivo:

```bash
# 1. Navegar al directorio de IA
cd ai_service

# 2. Activar entorno virtual
.\.venv\Scripts\activate

# 3. Ejecutar predicción de demanda
python predict_demand.py --insumo 1 --horizonte 30
```

Salida esperada (JSON formateado):
```json
{
  "insumo_id": 1,
  "nombre": "Amoxicilina 500mg",
  "demanda_proyectada_mes": 1250,
  "stock_seguridad_sugerido": 180,
  "punto_reorden_sugerido": 430,
  "confianza_r2": 0.89,
  "alerta_reabastecimiento": false
}
```
