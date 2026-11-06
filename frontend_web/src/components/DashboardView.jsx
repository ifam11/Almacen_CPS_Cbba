/**
 * @file DashboardView.jsx
 * @description Vista Dashboard premium con KPIs, gráficos visuales, semáforo de caducidad,
 * indicadores financieros y feed de actividad. Se visualiza cuando el usuario
 * selecciona "Dashboard" en el Sidebar.
 * Color institucional: #007B6D (Verde CPS).
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PackageCheck,
  AlertTriangle,
  FileCheck2,
  Building2,
  DollarSign,
  Boxes,
  Activity,
  ArrowUpFromLine,
  ArrowDownToLine,
  ShieldCheck,
  Clock,
  Truck,
  Pill,
  BarChart3,
  PieChart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Zap,
  RefreshCw
} from 'lucide-react';
import GrafanaEmbed from './grafana/GrafanaEmbed';

const DashboardView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('operativo'); // 'operativo' | 'grafana'

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock dashboard data
  const kpiCards = [
    {
      title: 'Egresos del Día',
      value: '38',
      unit: 'Solicitudes',
      change: '+12%',
      positive: true,
      icon: PackageCheck,
      color: 'from-[#007B6D] to-[#009688]',
      bgLight: 'bg-teal-50',
      textColor: 'text-[#007B6D]',
      description: '100% Dispensados FEFO'
    },
    {
      title: 'Despachos Quirófano',
      value: '14',
      unit: 'Paquetes',
      change: '+5',
      positive: true,
      icon: FileCheck2,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Cirugías Programadas'
    },
    {
      title: 'Traspasos Activos',
      value: '4',
      unit: 'En Tránsito',
      change: '-1',
      positive: false,
      icon: Truck,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      description: 'Quillacollo & Ayacucho'
    },
    {
      title: 'Alertas Caducidad',
      value: '2',
      unit: 'Lotes Críticos',
      change: 'Urgente',
      positive: false,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Cuarentena Preventiva'
    }
  ];

  const financialData = [
    { label: 'Fármacos Sanitarios', value: 'Bs 2,340,890', percentage: 68, color: '#007B6D' },
    { label: 'Material Quirúrgico', value: 'Bs 890,450', percentage: 26, color: '#4DB6AC' },
    { label: 'Material Administrativo', value: 'Bs 210,320', percentage: 6, color: '#80CBC4' }
  ];

  const expiryAlerts = [
    { lote: 'LOT-AMOX-2025', insumo: 'Amoxicilina 500mg', dias: 6, unidades: 120, nivel: 'critico' },
    { lote: 'LOT-CEF-2025', insumo: 'Cefazolina 1g IV', dias: 22, unidades: 85, nivel: 'alerta' },
    { lote: 'LOT-PARAC-2025', insumo: 'Paracetamol Jarabe', dias: 28, unidades: 200, nivel: 'alerta' },
    { lote: 'LOT-DIPIR-2025', insumo: 'Dipirona Inyectable', dias: 45, unidades: 310, nivel: 'precaucion' },
    { lote: 'LOT-OMEP-2025', insumo: 'Omeprazol 40mg', dias: 58, unidades: 150, nivel: 'precaucion' }
  ];

  const recentActivity = [
    { time: '14:32', action: 'Egreso EGR-8901 aprobado', user: 'Lic. Claros', type: 'egreso' },
    { time: '14:18', action: 'Recepción Lote LOT-BAGO-9920', user: 'Sr. Mamani', type: 'ingreso' },
    { time: '13:55', action: 'Traspaso TR-082 completado', user: 'Lic. Claros', type: 'traspaso' },
    { time: '13:40', action: 'Alerta FEFO: Amoxicilina 500mg', user: 'Sistema', type: 'alerta' },
    { time: '13:12', action: 'Egreso EGR-8900 confirmado Quirófano', user: 'Lic. Vargas', type: 'egreso' },
    { time: '12:45', action: 'Inventario físico validado Pasillo 3', user: 'Sr. López', type: 'inventario' }
  ];

  const monthlyStats = [
    { month: 'May', ingresos: 245, egresos: 198 },
    { month: 'Jun', ingresos: 312, egresos: 287 },
    { month: 'Jul', ingresos: 278, egresos: 265 },
    { month: 'Ago', ingresos: 356, egresos: 310 },
    { month: 'Sep', ingresos: 298, egresos: 275 },
    { month: 'Oct', ingresos: 189, egresos: 162 }
  ];

  const maxStat = Math.max(...monthlyStats.flatMap(s => [s.ingresos, s.egresos]));

  const getNivelStyle = (nivel) => {
    switch (nivel) {
      case 'critico': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: '🔴 CRÍTICO', dot: 'bg-red-500' };
      case 'alerta': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '🟡 ALERTA', dot: 'bg-amber-500' };
      case 'precaucion': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: '🟠 PRECAUCIÓN', dot: 'bg-yellow-500' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Normal', dot: 'bg-gray-400' };
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'egreso': return <ArrowUpFromLine size={14} className="text-[#007B6D]" />;
      case 'ingreso': return <ArrowDownToLine size={14} className="text-blue-600" />;
      case 'traspaso': return <Truck size={14} className="text-amber-600" />;
      case 'alerta': return <AlertTriangle size={14} className="text-red-500" />;
      case 'inventario': return <Boxes size={14} className="text-purple-600" />;
      default: return <Activity size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado del Dashboard con Selector de Modo Operativo vs Grafana */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#007B6D] to-[#009688] flex items-center justify-center shadow-lg shadow-teal-900/20 text-white">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Dashboard Operativo & Analítico
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  CPS Cochabamba
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Almacén Central — Hospital Obrero N° 2 • {currentTime.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Vista: Nativa vs Grafana */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200/60">
            <button
              onClick={() => setViewMode('operativo')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'operativo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Boxes size={14} className={viewMode === 'operativo' ? 'text-[#007B6D]' : ''} />
              Vista Operativa Nativa
            </button>
            <button
              onClick={() => setViewMode('grafana')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grafana'
                  ? 'bg-[#007B6D] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Activity size={14} className={viewMode === 'grafana' ? 'text-white animate-pulse' : 'text-teal-600'} />
              Telemetría Grafana (En Vivo)
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                viewMode === 'grafana' ? 'bg-teal-800 text-teal-100' : 'bg-teal-100 text-[#007B6D]'
              }`}>
                3001
              </span>
            </button>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-teal-50 hover:text-[#007B6D] transition shadow-2xs"
            title="Recargar datos"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Renderizado Condicional: Tablero Grafana vs Vista Nativa */}
      {viewMode === 'grafana' ? (
        <div className="space-y-4">
          <GrafanaEmbed
            dashboardUid="cps-almacen-operativo"
            title="Telemetría Operativa y Lotes FEFO/FIFO — Grafana OSS"
            subtitle="Métricas de Inventario, Valorización Financiera, Semáforo de Caducidad y Flujo Kardex en tiempo real"
            height="850px"
          />
        </div>
      ) : (
        <>
          {/* Banner de acceso rápido a Grafana dentro de la vista nativa */}
          <div className="bg-gradient-to-r from-gray-900 via-[#062420] to-gray-900 text-white p-3.5 px-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-teal-900/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Activity size={16} className="animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  Motor de Observabilidad Grafana Activo
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </p>
                <p className="text-[11px] text-gray-300">
                  Servicio conectado a MySQL 8 (<code className="text-teal-300">almacen_cps</code> en puerto 3001). Telemetría y auditoría en tiempo real.
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('grafana')}
              className="px-3 py-1.5 bg-[#007B6D] hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Ver Paneles en Grafana</span>
              <ArrowRight size={13} />
            </button>
          </div>

      {/* === FILA 1: KPI CARDS PREMIUM === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-card card-hover animate-slideInUp delay-${idx + 1} relative overflow-hidden`}
            >
              {/* Decoración de fondo sutil */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.color} opacity-[0.06]`} />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
                    <span className="text-xs font-medium text-gray-500">{kpi.unit}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {kpi.positive ? (
                      <TrendingUp size={12} className="text-[#007B6D]" />
                    ) : (
                      <TrendingDown size={12} className={kpi.textColor} />
                    )}
                    <span className={`text-[11px] font-bold ${kpi.positive ? 'text-[#007B6D]' : kpi.textColor}`}>
                      {kpi.change}
                    </span>
                    <span className="text-[10px] text-gray-400">• {kpi.description}</span>
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-xl ${kpi.bgLight} ${kpi.textColor} flex items-center justify-center shadow-xs`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* === FILA 2: GRÁFICO DE BARRAS + DISTRIBUCIÓN FINANCIERA === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gráfico de Barras: Movimientos Mensuales */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-card animate-slideInUp delay-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <BarChart3 size={16} className="text-[#007B6D]" />
                Movimientos Mensuales
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Comparativa Ingresos vs Egresos — Último Semestre</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#007B6D]"></span>
                <span className="font-semibold text-gray-600">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#80CBC4]"></span>
                <span className="font-semibold text-gray-600">Egresos</span>
              </div>
            </div>
          </div>

          {/* Gráfico de barras CSS */}
          <div className="flex items-end justify-between gap-3 h-48">
            {monthlyStats.map((stat, idx) => (
              <div key={stat.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-1 w-full h-40">
                  <div className="flex-1 flex flex-col justify-end items-center">
                    <span className="text-[9px] font-bold text-gray-500 mb-1">{stat.ingresos}</span>
                    <div
                      className="w-full bg-gradient-to-t from-[#006459] to-[#007B6D] rounded-t-lg transition-all duration-700 ease-out"
                      style={{ height: `${(stat.ingresos / maxStat) * 100}%`, animationDelay: `${idx * 100}ms` }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center">
                    <span className="text-[9px] font-bold text-gray-500 mb-1">{stat.egresos}</span>
                    <div
                      className="w-full bg-gradient-to-t from-[#80CBC4] to-[#4DB6AC] rounded-t-lg transition-all duration-700 ease-out"
                      style={{ height: `${(stat.egresos / maxStat) * 100}%`, animationDelay: `${idx * 100 + 50}ms` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-600 mt-1">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución Financiera */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card animate-slideInUp delay-2">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-[#007B6D]" />
            Valorización de Inventario
          </h3>
          <p className="text-[11px] text-gray-500 mb-5">Distribución por tipo de insumo</p>

          {/* Total */}
          <div className="text-center mb-5 p-4 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Valorización Total</p>
            <p className="text-2xl font-black text-gray-900 mt-1">Bs 3,441,660</p>
            <p className="text-[11px] text-[#007B6D] font-semibold mt-1">+8.3% vs mes anterior</p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-4">
            {financialData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  <span className="text-xs font-black text-gray-900">{item.value}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 text-right">{item.percentage}% del total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === FILA 3: SEMÁFORO DE CADUCIDAD + FEED DE ACTIVIDAD === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Semáforo de Caducidad */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-slideInUp delay-3">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <AlertOctagon size={16} className="text-red-500" />
                Semáforo de Caducidad
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Lotes con vencimiento próximo — Control FEFO</p>
            </div>
            <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
              {expiryAlerts.filter(a => a.nivel === 'critico').length} Críticos
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {expiryAlerts.map((alert, idx) => {
              const style = getNivelStyle(alert.nivel);
              return (
                <div key={alert.lote} className={`px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${alert.nivel === 'critico' ? 'bg-red-50/30' : ''}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-8 rounded-full ${style.dot}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900 truncate">{alert.insumo}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                          {style.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-gray-500">{alert.lote}</span>
                        <span className="text-[10px] text-gray-400">•</span>
                        <span className="text-[10px] text-gray-500">{alert.unidades} uds</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-sm font-black ${alert.nivel === 'critico' ? 'text-red-600' : alert.nivel === 'alerta' ? 'text-amber-600' : 'text-yellow-600'}`}>
                      {alert.dias}d
                    </span>
                    <p className="text-[9px] text-gray-400">restantes</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
            <span className="text-[10px] text-gray-500 font-medium">
              🔴 &lt;30 días = Crítico • 🟡 30-44 días = Alerta • 🟠 45-60 días = Precaución
            </span>
          </div>
        </div>

        {/* Feed de Actividad Reciente */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-slideInUp delay-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Activity size={16} className="text-[#007B6D]" />
                Actividad Reciente del Almacén
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Últimas operaciones registradas hoy</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4DB6AC] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007B6D]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#007B6D]">En vivo</span>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="px-5 py-3.5 flex items-center gap-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.action}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    por <span className="font-semibold text-gray-700">{item.user}</span>
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 shrink-0 bg-gray-50 px-2 py-0.5 rounded-md">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
            <button className="text-[11px] text-[#007B6D] font-bold hover:underline flex items-center gap-1 mx-auto">
              Ver toda la bitácora de auditoría
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* === FILA 4: MÉTRICAS RÁPIDAS RESUMIDAS === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-slideInUp">
        {[
          { label: 'Insumos Activos', value: '1,248', icon: Pill, color: 'text-[#007B6D]', bg: 'bg-teal-50' },
          { label: 'Proveedores', value: '34', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Lotes en Stock', value: '892', icon: Boxes, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Usuarios RBAC', value: '12', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Regla FEFO OK', value: '100%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Uptime Sistema', value: '99.9%', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs text-center card-hover">
              <div className={`w-8 h-8 rounded-lg ${metric.bg} ${metric.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={16} />
              </div>
              <p className="text-lg font-black text-gray-900">{metric.value}</p>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{metric.label}</p>
            </div>
          );
        })}
      </div>
    </>
  )}
</div>
  );
};

export default DashboardView;
