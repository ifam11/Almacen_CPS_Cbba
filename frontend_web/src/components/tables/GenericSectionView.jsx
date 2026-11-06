/**
 * @file GenericSectionView.jsx
 * @description Vista representativa premium para las secciones del menú lateral complementarias.
 * Color institucional: #007B6D (Verde CPS).
 */

import React from 'react';
import { Package, ShieldCheck, ArrowRight, Activity, Database, CheckCircle2, Server } from 'lucide-react';

const GenericSectionView = ({ title, description, icon: Icon }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Superior de Sección */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#007B6D] flex items-center justify-center border border-[#80CBC4]/40 shadow-xs">
            {Icon ? <Icon size={28} /> : <Package size={28} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#007B6D] border border-[#80CBC4]">
                Activo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">{description || 'Módulo operativo de Almacén CPS Regional Cochabamba'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 flex items-center gap-2">
            <Server size={14} className="text-[#007B6D]" />
            <span>Sede Hospital Obrero N° 2</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen del Módulo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 border-t-4 border-t-[#007B6D] card-hover">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registros Procesados</span>
          <div className="text-3xl font-black text-gray-900 mt-2">1,248</div>
          <span className="text-xs text-[#007B6D] font-bold mt-1.5 inline-flex items-center gap-1">
            <CheckCircle2 size={12} /> Sincronizado en Tiempo Real
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 border-t-4 border-t-[#4DB6AC] card-hover">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estado Operacional</span>
          <div className="text-3xl font-black text-[#007B6D] mt-2">100% Óptimo</div>
          <span className="text-xs text-gray-500 font-medium mt-1.5 inline-block">
            Protocolos FEFO / FIFO Validados
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 border-t-4 border-t-blue-600 card-hover">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trazabilidad Sanitaria</span>
          <div className="text-3xl font-black text-blue-700 mt-2">Inmutable</div>
          <span className="text-xs text-gray-500 font-medium mt-1.5 inline-block">
            Firmas electrónicas y Kardex físico
          </span>
        </div>
      </div>

      {/* Contenido Informativo y Guía Rápida */}
      <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 text-[#007B6D] ring-4 ring-teal-100">
            <Activity size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900">Módulo de {title} Conectado</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Esta sección se encuentra vinculada a la base de datos relacional de la Caja Petrolera de Salud Regional Cochabamba.
            Para auditar los despachos y traspasos de farmacia clínica, despliegue el menú <strong>"Egresos"</strong> en el panel izquierdo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenericSectionView;
