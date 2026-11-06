/**
 * @file DashboardLayout.jsx
 * @description Layout principal premium del Dashboard para Caja Petrolera de Salud (CPS) Regional Cochabamba.
 * Integra el Sidebar responsive, Header dinámico, vista Dashboard con KPIs y las 5 tablas exactas.
 * Color institucional: #007B6D (Verde CPS).
 */

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// Dashboard Integral
import DashboardView from '../DashboardView';
import SucursalesView from '../SucursalesView';
import MobileSimulatorView from '../MobileSimulatorView';
import AIPredictionsView from '../AIPredictionsView';

// 5 Tablas Exactas Requeridas
import ListadoEgresosTable from '../tables/ListadoEgresosTable';
import PedidosServicioEgresarTable from '../tables/PedidosServicioEgresarTable';
import ReporteEgresoAlmacenTable from '../tables/ReporteEgresoAlmacenTable';
import TraspasoSubAlmacenTable from '../tables/TraspasoSubAlmacenTable';
import TraspasoVencidosTable from '../tables/TraspasoVencidosTable';

// Vista para Secciones Complementarias
import GenericSectionView from '../tables/GenericSectionView';
import GrafanaEmbed from '../grafana/GrafanaEmbed';

import {
  ShoppingCart,
  ArrowDownToLine,
  Repeat,
  Building2,
  Layers,
  Boxes,
  ShieldCheck
} from 'lucide-react';

const DashboardLayout = () => {
  // Estado para la vista activa. Inicia en 'dashboard' para mostrar KPIs
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mapeo de metadatos (Título y Breadcrumb) para el Header
  const getViewMetadata = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          title: 'Dashboard Operativo',
          breadcrumb: 'Dashboard'
        };
      case 'simulador-movil':
        return {
          title: 'Simulador de App Móvil de Pasillo',
          breadcrumb: 'Móvil / Simulador Operario'
        };
      case 'ia':
      case 'predicciones-ia':
        return {
          title: 'Módulo Central de Inteligencia Artificial (SIGMAT IA)',
          breadcrumb: 'Inteligencia Artificial / Predicción Demanda & ROP'
        };
      case 'grafana':
        return {
          title: 'Centro de Observabilidad & Analítica (Grafana v10)',
          breadcrumb: 'Analítica / Observabilidad Grafana'
        };
      case 'listado-egresos':
        return {
          title: 'Listado General de Egresos',
          breadcrumb: 'Egresos / Listado Egresos'
        };
      case 'pedidos-servicio':
        return {
          title: 'Pedidos de Servicios Médicos por Egresar',
          breadcrumb: 'Egresos / Pedidos Servicio X Egresar'
        };
      case 'egresos-registrados':
        return {
          title: 'Historial de Egresos Registrados',
          breadcrumb: 'Egresos / Egresos Registrados'
        };
      case 'traspaso-subalmacen':
        return {
          title: 'Traspaso a SubAlmacenes y Policlínicos',
          breadcrumb: 'Egresos / Traspaso SubAlmacén'
        };
      case 'traspaso-vencidos':
        return {
          title: 'Control y Traspaso de Lotes Vencidos',
          breadcrumb: 'Egresos / Traspaso Vencidos'
        };
      case 'informes-egreso':
        return {
          title: 'Reporte de Egreso Almacén Central',
          breadcrumb: 'Informes / Reporte de Egreso'
        };
      case 'pedidos-compra':
        return {
          title: 'Gestión de Pedidos para Compra',
          breadcrumb: 'Pedidos para Compra'
        };
      case 'ingresos':
        return {
          title: 'Recepción e Ingreso de Mercancía por Lotes',
          breadcrumb: 'Ingresos'
        };
      case 'movimientos-especiales':
        return {
          title: 'Movimientos Especiales de Almacén',
          breadcrumb: 'Movimientos Especiales'
        };
      case 'sucursales':
        return {
          title: 'Red de Sucursales y Policlínicos Cochabamba',
          breadcrumb: 'Sucursales'
        };
      case 'saldos':
        return {
          title: 'Consulta de Saldos Físicos y Valorados',
          breadcrumb: 'Saldos'
        };
      case 'inventario':
        return {
          title: 'Inventario General y Rotación FEFO',
          breadcrumb: 'Inventario'
        };
      case 'administracion':
        return {
          title: 'Panel de Administración y Control de Usuarios',
          breadcrumb: 'Administración'
        };
      default:
        return {
          title: 'Almacén Central CPS Cochabamba',
          breadcrumb: 'Almacenes'
        };
    }
  };

  const { title, breadcrumb } = getViewMetadata();

  // Renderizado dinámico del área de contenido principal
  const renderContent = () => {
    switch (activeView) {
      // DASHBOARD: Vista principal con KPIs
      case 'dashboard':
        return <DashboardView />;

      // SIMULADOR MÓVIL EN VIVO
      case 'simulador-movil':
        return <MobileSimulatorView />;

      // MÓDULO CENTRAL DE INTELIGENCIA ARTIFICIAL
      case 'ia':
      case 'predicciones-ia':
        return <AIPredictionsView />;

      // 1. Tabla: Listado Egresos
      case 'listado-egresos':
        return <ListadoEgresosTable />;

      // 2. Tabla: Pedidos Servicio X Egresar
      case 'pedidos-servicio':
        return <PedidosServicioEgresarTable />;

      // Egresos Registrados
      case 'egresos-registrados':
        return <ListadoEgresosTable />;

      // 4. Tabla: Traspaso SubAlmacén
      case 'traspaso-subalmacen':
        return <TraspasoSubAlmacenTable />;

      // 5. Tabla: Traspaso Vencidos
      case 'traspaso-vencidos':
        return <TraspasoVencidosTable />;

      // 3. Tabla: Reporte de Egreso Almacén Central (Sección Informes)
      case 'informes-egreso':
        return <ReporteEgresoAlmacenTable />;

      // 6. Centro de Observabilidad Grafana Integral
      case 'grafana':
        return (
          <div className="space-y-6">
            <GrafanaEmbed
              dashboardUid="cps-almacen-operativo"
              title="Centro Unificado de Observabilidad — Almacén Central CPS"
              subtitle="Telemetría en tiempo real: Lotes FEFO/FIFO, Métricas Contables del Kardex y Predicción de Demanda"
              height="880px"
            />
          </div>
        );

      // Secciones complementarias
      case 'pedidos-compra':
        return (
          <GenericSectionView
            title="Pedidos para Compra"
            description="Requisiciones institucionales y órdenes de adquisición farmacéutica para el Hospital Obrero N° 2"
            icon={ShoppingCart}
          />
        );
      case 'ingresos':
        return (
          <GenericSectionView
            title="Ingreso de Mercancía y Lotes"
            description="Recepción física, control de calidad y generación de etiquetas QR con trazabilidad inmutable"
            icon={ArrowDownToLine}
          />
        );
      case 'movimientos-especiales':
        return (
          <GenericSectionView
            title="Movimientos Especiales"
            description="Ajustes de inventario, bajas justificadas y donaciones interinstitucionales autorizadas"
            icon={Repeat}
          />
        );
      case 'sucursales':
        return <SucursalesView />;
      case 'saldos':
        return (
          <GenericSectionView
            title="Saldos de Inventario"
            description="Existencias consolidadas por lote y balance contable valorado en tiempo real"
            icon={Layers}
          />
        );
      case 'inventario':
        return (
          <GenericSectionView
            title="Inventario Físico y Rotación"
            description="Matriz integral de insumos médicos con aplicación estricta de la regla FEFO hospitalaria"
            icon={Boxes}
          />
        );
      case 'administracion':
        return (
          <GenericSectionView
            title="Administración del Sistema"
            description="Control de usuarios, roles RBAC y bitácora de auditoría inmutable bajo estándar ACID"
            icon={ShieldCheck}
          />
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F3] text-[#1A2332] flex font-sans antialiased selection:bg-[#80CBC4]/30 selection:text-[#007B6D]">
      {/* 1. Menú Lateral Izquierdo (Sidebar w-72) — responsive */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Área de Contenido Principal */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen content-area">
        {/* Header Superior con Reloj, Hamburguesa y Perfil */}
        <Header
          activeTitle={title}
          activeBreadcrumb={breadcrumb}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Contenido Dinámico */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full w-full">
          {renderContent()}
        </main>

        {/* Pie de Página Institucional */}
        <footer className="py-4 px-4 sm:px-8 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#007B6D]"></span>
            <span>Caja Petrolera de Salud (CPS) — Regional Cochabamba • Sistema Integral de Almacenes</span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            Servidor Local: 127.0.0.1:5000 | Conexión Segura TLS
          </span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
