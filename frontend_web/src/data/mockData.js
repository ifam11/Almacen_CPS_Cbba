/**
 * @file mockData.js
 * @description Datos de prueba realistas para Almacenes - Caja Petrolera de Salud (CPS) Regional Cochabamba.
 */

// 1. Tabla: Listado Egresos
export const mockListadoEgresos = [
  {
    id: 1,
    identificacion: "EGR-CBBA-2026-001",
    nroEgreso: "EGR-8901",
    servicio: "Emergencias Médicas (Pabellón A)",
    nroPedido: "PED-4521",
    fecha: "14/10/2026",
    subalmacen: "Subalmacén Urgencias",
    estado: "Aprobado"
  },
  {
    id: 2,
    identificacion: "EGR-CBBA-2026-002",
    nroEgreso: "EGR-8902",
    servicio: "Quirófano Central 3",
    nroPedido: "PED-4528",
    fecha: "14/10/2026",
    subalmacen: "Subalmacén Quirúrgico",
    estado: "Pendiente"
  },
  {
    id: 3,
    identificacion: "EGR-CBBA-2026-003",
    nroEgreso: "EGR-8898",
    servicio: "Unidad de Terapia Intensiva (UTI Adultos)",
    nroPedido: "PED-4510",
    fecha: "13/10/2026",
    subalmacen: "Subalmacén Farmacia UTI",
    estado: "Aprobado"
  },
  {
    id: 4,
    identificacion: "EGR-CBBA-2026-004",
    nroEgreso: "EGR-8890",
    servicio: "Pediatría y Neonatología",
    nroPedido: "PED-4495",
    fecha: "12/10/2026",
    subalmacen: "Subalmacén Pediátrico",
    estado: "Rechazado"
  },
  {
    id: 5,
    identificacion: "EGR-CBBA-2026-005",
    nroEgreso: "EGR-8884",
    servicio: "Traumatología y Cirugía Menor",
    nroPedido: "PED-4482",
    fecha: "11/10/2026",
    subalmacen: "Subalmacén Traumatología",
    estado: "Aprobado"
  },
  {
    id: 6,
    identificacion: "EGR-CBBA-2026-006",
    nroEgreso: "EGR-8879",
    servicio: "Laboratorio Clínico y Banco de Sangre",
    nroPedido: "PED-4470",
    fecha: "10/10/2026",
    subalmacen: "Subalmacén Bioquímica",
    estado: "Pendiente"
  }
];

// 2. Tabla: Pedidos Servicio X Egresar
export const mockPedidosServicioEgresar = [
  {
    id: 1,
    nroPedido: "PED-4530",
    fecha: "14/10/2026",
    servicio: "Ginecología y Obstetricia",
    estado: "Por Despachar",
    grupoPedido: "Fármacos de Alto Consumo"
  },
  {
    id: 2,
    nroPedido: "PED-4531",
    fecha: "14/10/2026",
    servicio: "Cardiología y Hemodinamia",
    estado: "En Preparación",
    grupoPedido: "Material Quirúrgico Especializado"
  },
  {
    id: 3,
    nroPedido: "PED-4532",
    fecha: "14/10/2026",
    servicio: "Emergencias Nocturnas",
    estado: "Urgente",
    grupoPedido: "Sueros y Soluciones Fisiológicas"
  },
  {
    id: 4,
    nroPedido: "PED-4529",
    fecha: "13/10/2026",
    servicio: "Hemodiálisis y Nefrología",
    estado: "Por Despachar",
    grupoPedido: "Insumos de Diálisis Renal"
  },
  {
    id: 5,
    nroPedido: "PED-4525",
    fecha: "13/10/2026",
    servicio: "Consulta Externa Policlínico",
    estado: "En Espera",
    grupoPedido: "Material Sanitario Descartable"
  }
];

// 3. Tabla: Reporte de Egreso Almacén Central
export const mockReporteEgresoAlmacen = [
  {
    id: 1,
    nroEgreso: "EGR-8901",
    fecha: "14/10/2026",
    servicio: "Emergencias Médicas",
    codigo: "MED-AMOX-500",
    descripcion: "Amoxicilina 500mg Cápsulas",
    unidad: "Caja x 100",
    cantidad: 25,
    lote: "LOT-INTI-2026X",
    vencimiento: "20/10/2026", // Vence en 6 días (Crítico)
    esVencido: true,
    almacen: "Almacén Central Cochabamba"
  },
  {
    id: 2,
    nroEgreso: "EGR-8901",
    fecha: "14/10/2026",
    servicio: "Emergencias Médicas",
    codigo: "MED-PARAC-1G",
    descripcion: "Paracetamol 1g Inyectable IV",
    unidad: "Frasco",
    cantidad: 150,
    lote: "LOT-BAGO-8812",
    vencimiento: "15/11/2027",
    esVencido: false,
    almacen: "Almacén Central Cochabamba"
  },
  {
    id: 3,
    nroEgreso: "EGR-8902",
    fecha: "14/10/2026",
    servicio: "Quirófano Central 3",
    codigo: "MAT-SUT-VICRYL",
    descripcion: "Sutura Vicryl 3-0 c/ Aguja Curva",
    unidad: "Caja x 36",
    cantidad: 40,
    lote: "LOT-ETH-2025B",
    vencimiento: "01/09/2026", // Ya vencido
    esVencido: true,
    almacen: "Almacén Central Cochabamba"
  },
  {
    id: 4,
    nroEgreso: "EGR-8898",
    fecha: "13/10/2026",
    servicio: "UTI Adultos",
    codigo: "MED-FENT-05MG",
    descripcion: "Fentanilo 0.5mg/10ml Ampolla",
    unidad: "Ampolla",
    cantidad: 60,
    lote: "LOT-SINT-4410",
    vencimiento: "30/08/2028",
    esVencido: false,
    almacen: "Almacén Central Cochabamba"
  },
  {
    id: 5,
    nroEgreso: "EGR-8884",
    fecha: "11/10/2026",
    servicio: "Traumatología",
    codigo: "MAT-YESO-6P",
    descripcion: "Venda de Yeso 6 pulgadas x 5 yardas",
    unidad: "Docena",
    cantidad: 30,
    lote: "LOT-BSN-9021",
    vencimiento: "12/03/2029",
    esVencido: false,
    almacen: "Almacén Central Cochabamba"
  }
];

// 4. Tabla: Traspaso SubAlmacén
export const mockTraspasoSubAlmacen = [
  {
    id: 1,
    identificacion: "TRASP-0081",
    nroTraspaso: "TR-2026-081",
    fecha: "14/10/2026",
    origen: "Almacén Central CPS Cochabamba",
    destino: "Subalmacén Hospital Obrero N° 2",
    motivo: "Reabastecimiento Quincenal de Fármacos Críticos",
    estado: "En Tránsito"
  },
  {
    id: 2,
    identificacion: "TRASP-0082",
    nroTraspaso: "TR-2026-082",
    fecha: "13/10/2026",
    origen: "Almacén Central CPS Cochabamba",
    destino: "Subalmacén Policlínico Ayacucho",
    motivo: "Pedido Extraordinario Campaña Vacunación",
    estado: "Completado"
  },
  {
    id: 3,
    identificacion: "TRASP-0083",
    nroTraspaso: "TR-2026-083",
    fecha: "12/10/2026",
    origen: "Subalmacén Quirúrgico",
    destino: "Almacén Central CPS Cochabamba",
    motivo: "Devolución por Excedente Quirúrgico",
    estado: "Aprobado"
  },
  {
    id: 4,
    identificacion: "TRASP-0084",
    nroTraspaso: "TR-2026-084",
    fecha: "10/10/2026",
    origen: "Almacén Central CPS Cochabamba",
    destino: "Subalmacén Quillacollo",
    motivo: "Distribución Programada Mensual",
    estado: "Completado"
  }
];

// 5. Tabla: Traspaso Vencidos
export const mockTraspasoVencidos = [
  {
    id: 1,
    almacenOrigen: "Almacén Central Cochabamba - Pasillo 1 (Estantería B)",
    lotesVencidos: "LOT-AMOX-2025 (Cad. 01/10/2026), LOT-CEF-2025 (Cad. 15/09/2026)",
    totalUnidadesVencidas: 340,
    estadoBaja: "Pendiente Cuarentena"
  },
  {
    id: 2,
    almacenOrigen: "Subalmacén Urgencias - Botiquín de Shock",
    lotesVencidos: "LOT-ADREN-2025 (Cad. 28/09/2026)",
    totalUnidadesVencidas: 45,
    estadoBaja: "Listo p/ Destrucción"
  },
  {
    id: 3,
    almacenOrigen: "Subalmacén Policlínico Quillacollo",
    lotesVencidos: "LOT-PARAC-JAR-2025 (Cad. 05/10/2026)",
    totalUnidadesVencidas: 120,
    estadoBaja: "Pendiente Traspaso"
  },
  {
    id: 4,
    almacenOrigen: "Subalmacén Hospital Obrero N° 2 - Farmacia Satélite",
    lotesVencidos: "LOT-DICLO-75-2025 (Cad. 30/08/2026)",
    totalUnidadesVencidas: 215,
    estadoBaja: "En Cuarentena"
  }
];
