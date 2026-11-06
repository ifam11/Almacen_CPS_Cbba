/**
 * @file Header.jsx
 * @description Encabezado superior premium para el área de contenido principal con reloj digital en vivo,
 * breadcrumbs enriquecidos, hamburguesa responsive y perfil ficticio de alta fidelidad.
 * Color institucional: #007B6D (Verde CPS).
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Search,
  Home,
  ChevronRight,
  Menu,
  Building
} from 'lucide-react';

const Header = ({ activeTitle, activeBreadcrumb, onToggleSidebar }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fechaFormateada = time.toLocaleDateString('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const horaFormateada = time.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,123,109,0.06)]">
      {/* 1. Título y Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Hamburguesa para pantallas pequeñas */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-teal-50 text-gray-600 hover:text-[#007B6D] transition-colors border border-gray-200"
        >
          <Menu size={20} />
        </button>

        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1 text-gray-400 hover:text-[#007B6D] transition cursor-pointer">
              <Home size={13} />
              <span>Inicio</span>
            </span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-400">Regional Cochabamba</span>
            {activeBreadcrumb && (
              <>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-[#007B6D] font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  {activeBreadcrumb}
                </span>
              </>
            )}
          </nav>

          <h1 className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 tracking-tight flex items-center gap-2.5 flex-wrap">
            <span>{activeTitle}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#007B6D] border border-[#80CBC4]">
              En Línea
            </span>
          </h1>
        </div>
      </div>

      {/* 2. Acciones, Reloj en Vivo y Perfil */}
      <div className="flex items-center gap-3">
        {/* Reloj y Fecha Oficial en Vivo */}
        <div className="hidden xl:flex items-center gap-2 text-xs bg-gray-50/80 border border-gray-200/60 px-3.5 py-1.5 rounded-xl shadow-xs">
          <Calendar size={13} className="text-[#007B6D]" />
          <span className="capitalize font-medium text-gray-700">{fechaFormateada}</span>
          <span className="text-gray-300">|</span>
          <Clock size={13} className="text-[#007B6D]" />
          <span className="font-mono font-bold text-gray-900">{horaFormateada}</span>
        </div>

        {/* Campana de Notificaciones con Badge de Alertas Críticas */}
        <button
          className="relative p-2.5 text-gray-600 hover:text-[#007B6D] hover:bg-teal-50 rounded-xl transition border border-gray-200/60 shadow-xs"
          title="Notificaciones de alertas de stock y lotes vencidos"
          onClick={() => alert('Notificaciones: 2 lotes en Alerta Roja de caducidad (<30 días).')}
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#EF4444] text-[9px] font-extrabold text-white items-center justify-center">
              2
            </span>
          </span>
        </button>

        {/* Separador vertical */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Perfil de Usuario Ficticio */}
        <div className="hidden sm:flex items-center gap-3 bg-gray-50/80 hover:bg-gray-100/80 px-3 py-1.5 rounded-2xl border border-gray-200/60 transition cursor-pointer shadow-xs">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#006459] to-[#007B6D] text-white flex items-center justify-center font-black text-xs shadow-md shadow-teal-900/20 ring-2 ring-[#80CBC4]">
              RC
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4DB6AC] rounded-full border-2 border-white"></span>
          </div>

          <div className="text-left leading-tight">
            <div className="text-xs font-black text-gray-900">
              Lic. Roberto Claros
            </div>
            <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
              <span>Encargado de Almacén</span>
              <span className="text-[#007B6D] font-bold">• CPS CBBA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
