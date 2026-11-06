/**
 * @file Sidebar.jsx
 * @description Menú lateral izquierdo premium institucional para la Caja Petrolera de Salud (CPS) Regional Cochabamba.
 * Verde Institucional (#007B6D), Acordeón Desplegable en 'Egresos', Badges, vista 'Dashboard' y estética de alta fidelidad.
 * Incluye botón hamburguesa para modo responsive y overlay en pantallas pequeñas.
 */

import React, { useState } from 'react';
import {
  ShoppingCart,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  Repeat,
  Building2,
  Layers,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ListFilter,
  ArrowLeftRight,
  AlertOctagon,
  FileSpreadsheet,
  Activity,
  Hospital,
  LayoutDashboard,
  Smartphone,
  Brain,
  Sparkles,
  X
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, isOpen, onClose }) => {
  // Estado para el acordeón desplegable de 'Egresos' (Abierto por defecto)
  const [egresosOpen, setEgresosOpen] = useState(true);

  // Subsecciones exactas de Egresos
  const subItemsEgresos = [
    { id: 'pedidos-servicio', label: 'Pedidos Servicio X Egresar', icon: Clock, badge: '5 pend.' },
    { id: 'egresos-registrados', label: 'Egresos Registrados', icon: CheckCircle2, badge: null },
    { id: 'listado-egresos', label: 'Listado Egresos', icon: ListFilter, badge: 'Activo' },
    { id: 'traspaso-subalmacen', label: 'Traspaso SubAlmacén', icon: ArrowLeftRight, badge: '4' },
    { id: 'traspaso-vencidos', label: 'Traspaso Vencidos', icon: AlertOctagon, badge: 'Crítico', badgeColor: 'bg-red-500' }
  ];

  const handleEgresosClick = () => {
    setEgresosOpen(!egresosOpen);
    if (!subItemsEgresos.some(item => item.id === activeView)) {
      setActiveView('listado-egresos');
    }
  };

  const handleNavClick = (view) => {
    setActiveView(view);
    if (onClose) onClose();
  };

  const isEgresoSubitemActive = subItemsEgresos.some(item => item.id === activeView);

  return (
    <>
      {/* Overlay para móvil/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`w-72 bg-gradient-to-b from-[#004D44] via-[#007B6D] to-[#004D44] text-white flex flex-col h-screen fixed left-0 top-0 shadow-sidebar z-40 select-none border-r border-[#006459]/40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* 1. Cabecera Institucional con Escudo y Tipografía Médica */}
        <div className="p-5 border-b border-teal-900/50 bg-[#004D44]/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/20 ring-2 ring-[#80CBC4]/50 shrink-0">
                  <span className="text-[#007B6D] text-2xl font-black tracking-tighter">✚</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#4DB6AC] rounded-full border-2 border-[#004D44] animate-pulse"></span>
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-wide uppercase leading-tight text-white drop-shadow-sm">
                  Caja Petrolera
                </h1>
                <h2 className="text-xs font-bold text-teal-200 uppercase tracking-widest">
                  de Salud
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#80CBC4]"></span>
                  <p className="text-[10px] text-[#80CBC4] font-semibold uppercase tracking-wider">
                    Regional Cochabamba
                  </p>
                </div>
              </div>
            </div>
            {/* Botón cerrar solo en móvil */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-teal-200 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between bg-[#003D35]/70 px-3 py-1.5 rounded-xl border border-teal-800/50 text-[10px]">
            <span className="font-bold text-teal-300 tracking-wider flex items-center gap-1.5">
              <Hospital size={12} className="text-[#80CBC4]" />
              ALMACÉN CENTRAL
            </span>
            <span className="bg-[#007B6D] text-[#80CBC4] font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">
              HOSP. OBRERO N° 2
            </span>
          </div>
        </div>

        {/* 2. Lista de Navegación con Secciones Categorizadas */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 text-xs font-medium sidebar-scroll pr-2">

          {/* DASHBOARD - NUEVA VISTA */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                activeView === 'dashboard'
                  ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${activeView === 'dashboard' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                  <LayoutDashboard size={16} />
                </div>
                <span className="font-bold">Dashboard</span>
              </div>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                KPIs
              </span>
            </button>

            {/* SIMULADOR DE APP MÓVIL EN VIVO */}
            <button
              onClick={() => handleNavClick('simulador-movil')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                activeView === 'simulador-movil'
                  ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${activeView === 'simulador-movil' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                  <Smartphone size={16} />
                </div>
                <span className="font-bold">App Móvil Pasillo</span>
              </div>
              <span className="text-[9px] bg-[#80CBC4] text-[#004D44] px-1.5 py-0.5 rounded-full font-black">
                En vivo
              </span>
            </button>

            {/* INTELIGENCIA ARTIFICIAL - RANDOM FOREST & ROP */}
            <button
              onClick={() => handleNavClick('ia')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                activeView === 'ia' || activeView === 'predicciones-ia'
                  ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${activeView === 'ia' || activeView === 'predicciones-ia' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                  <Brain size={16} />
                </div>
                <span className="font-bold">Inteligencia Artificial</span>
              </div>
              <span className="text-[9px] bg-gradient-to-r from-[#4DB6AC] to-[#80CBC4] text-[#004D44] px-1.5 py-0.5 rounded-full font-black">
                RF • ROP
              </span>
            </button>

            {/* OBSERVABILIDAD GRAFANA (EN VIVO - PUERTO 3001) */}
            <button
              onClick={() => handleNavClick('grafana')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                activeView === 'grafana'
                  ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${activeView === 'grafana' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                  <Activity size={16} className={activeView === 'grafana' ? 'animate-pulse' : ''} />
                </div>
                <span className="font-bold">Observabilidad Grafana</span>
              </div>
              <span className="text-[9px] bg-emerald-400 text-slate-900 px-1.5 py-0.5 rounded-full font-black animate-pulse">
                Live
              </span>
            </button>
          </div>

          {/* SECCIÓN: ADQUISICIÓN */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold text-teal-300/70 uppercase tracking-wider">
              Adquisición & Ingresos
            </div>
            <div className="space-y-1">
              {/* Pedidos para Compra */}
              <button
                onClick={() => handleNavClick('pedidos-compra')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  activeView === 'pedidos-compra'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'pedidos-compra' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <ShoppingCart size={16} />
                  </div>
                  <span>Pedidos para Compra</span>
                </div>
              </button>

              {/* Ingresos */}
              <button
                onClick={() => handleNavClick('ingresos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  activeView === 'ingresos'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'ingresos' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <ArrowDownToLine size={16} />
                  </div>
                  <span>Ingresos</span>
                </div>
                <span className="text-[10px] bg-teal-900/50 text-teal-300 px-2 py-0.5 rounded-full font-bold">Lotes</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN: DESPACHOS Y EGRESOS */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold text-teal-300/70 uppercase tracking-wider flex items-center justify-between">
              <span>Despachos y Salidas</span>
              <span className="text-[9px] bg-[#4DB6AC] text-[#004D44] px-1.5 py-0.5 rounded font-black">FEFO</span>
            </div>

            {/* EGRESOS: BOTÓN DESPLEGABLE CON ACORDEÓN */}
            <div className="rounded-xl overflow-hidden bg-black/10 p-1 border border-teal-800/30">
              <button
                onClick={handleEgresosClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isEgresoSubitemActive
                    ? 'bg-gradient-to-r from-[#006459] to-[#007B6D] text-white font-bold border-l-4 border-[#80CBC4] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isEgresoSubitemActive ? 'bg-[#80CBC4] text-[#004D44]' : 'bg-teal-900/50 text-teal-200'}`}>
                    <ArrowUpFromLine size={15} />
                  </div>
                  <span className="font-bold tracking-wide">Egresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded">
                    5 Vistas
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      egresosOpen ? 'rotate-180 text-[#80CBC4]' : 'text-teal-300'
                    }`}
                  />
                </div>
              </button>

              {/* Subítems del Acordeón Desplegable */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${egresosOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-1.5 pl-2 pr-1 space-y-1 pb-1">
                  {subItemsEgresos.map((sub) => {
                    const IconComponent = sub.icon;
                    const isActive = activeView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(sub.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] transition-all duration-150 text-left ${
                          isActive
                            ? 'bg-[#4DB6AC] text-[#004D44] font-bold shadow-md shadow-teal-950/20'
                            : 'text-teal-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent size={14} className={isActive ? 'text-[#004D44]' : 'text-teal-300'} />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                            sub.badgeColor || (isActive ? 'bg-[#004D44] text-white' : 'bg-teal-900/70 text-teal-200')
                          }`}>
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN: MOVIMIENTOS Y SUCURSALES */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold text-teal-300/70 uppercase tracking-wider">
              Logística & Red Hospitalaria
            </div>
            <div className="space-y-1">
              {/* Movimientos Especiales */}
              <button
                onClick={() => handleNavClick('movimientos-especiales')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'movimientos-especiales'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'movimientos-especiales' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <Repeat size={15} />
                  </div>
                  <span>Movimientos Especiales</span>
                </div>
              </button>

              {/* Sucursales */}
              <button
                onClick={() => handleNavClick('sucursales')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'sucursales'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'sucursales' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <Building2 size={15} />
                  </div>
                  <span>Sucursales</span>
                </div>
                <span className="text-[10px] text-teal-300">CBBA</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN: INFORMES, SALDOS E INVENTARIO */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-extrabold text-teal-300/70 uppercase tracking-wider">
              Auditoría & Control
            </div>
            <div className="space-y-1">
              {/* Informes (Reporte de Egreso Almacén Central) */}
              <button
                onClick={() => handleNavClick('informes-egreso')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'informes-egreso'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'informes-egreso' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <FileSpreadsheet size={15} />
                  </div>
                  <span>Informes</span>
                </div>
                <span className="bg-[#80CBC4] text-[#004D44] text-[9px] px-2 py-0.5 rounded-full font-black">
                  Central
                </span>
              </button>

              {/* Saldos */}
              <button
                onClick={() => handleNavClick('saldos')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'saldos'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'saldos' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <Layers size={15} />
                  </div>
                  <span>Saldos</span>
                </div>
              </button>

              {/* Inventario */}
              <button
                onClick={() => handleNavClick('inventario')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'inventario'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'inventario' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <Boxes size={15} />
                  </div>
                  <span>Inventario</span>
                </div>
              </button>

              {/* Administración */}
              <button
                onClick={() => handleNavClick('administracion')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all duration-200 group ${
                  activeView === 'administracion'
                    ? 'bg-white text-[#007B6D] font-bold shadow-lg shadow-black/10'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeView === 'administracion' ? 'bg-teal-50 text-[#007B6D]' : 'text-teal-300 group-hover:text-white'}`}>
                    <ShieldCheck size={15} />
                  </div>
                  <span>Administración</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* 3. Pie del Sidebar con Estado del Sistema */}
        <div className="p-4 bg-[#003D35] border-t border-teal-900/60 text-[11px] text-teal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#80CBC4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4DB6AC]"></span>
              </span>
              <span className="text-white font-bold text-xs">Servidor Conectado</span>
            </div>
            <span className="text-[10px] text-teal-400 font-mono">v2.4 - ACID</span>
          </div>
          <p className="text-[10px] text-teal-400/80 mt-1">
            Caja Petrolera de Salud • Bolivia
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
