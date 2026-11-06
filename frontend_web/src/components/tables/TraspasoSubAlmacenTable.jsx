/**
 * @file TraspasoSubAlmacenTable.jsx
 * @description Tabla: Traspaso SubAlmacén - Almacén Central CPS Cochabamba.
 * Columnas exactas: Identificación, Nro. Traspaso, Fecha, Origen, Destino, Motivo, Estado.
 */

import React, { useState } from 'react';
import {
  Search,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockTraspasoSubAlmacen } from '../../data/mockData';

const TraspasoSubAlmacenTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  const filteredData = mockTraspasoSubAlmacen.filter(item => {
    const matchesSearch =
      item.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nroTraspaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.motivo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === 'TODOS' || item.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Completado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2F1] text-[#007B6D] border border-[#80CBC4]/60 shadow-xs">
            <CheckCircle2 size={12} className="text-[#4DB6AC]" />
            Completado
          </span>
        );
      case 'En Tránsito':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs animate-pulse">
            <Truck size={12} className="text-amber-600" />
            En Tránsito
          </span>
        );
      case 'Aprobado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            <Clock size={12} className="text-blue-600" />
            Aprobado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden transition-all duration-200">
      {/* 1. Cabecera */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#007B6D]">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Traspaso a SubAlmacenes y Policlínicos
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Transferencias interhospitalarias autorizadas entre Almacén Central y dependencias regionales
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por origen, destino, motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B6D] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium border border-gray-200/60">
            {['TODOS', 'Completado', 'En Tránsito', 'Aprobado'].map((e) => (
              <button
                key={e}
                onClick={() => setFilterEstado(e)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterEstado === e
                    ? 'bg-white text-[#007B6D] font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {e === 'TODOS' ? 'Todos' : e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#004D44] to-[#007B6D] text-white font-bold uppercase tracking-wider text-[11px] select-none">
              <th className="py-4 px-5 whitespace-nowrap">Identificación</th>
              <th className="py-4 px-4 whitespace-nowrap">Nro. Traspaso</th>
              <th className="py-4 px-4 whitespace-nowrap">Fecha</th>
              <th className="py-4 px-5">Origen</th>
              <th className="py-4 px-5">Destino</th>
              <th className="py-4 px-5 min-w-[240px]">Motivo</th>
              <th className="py-4 px-4 text-center whitespace-nowrap">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                  No se registran traspasos a subalmacenes con los criterios de búsqueda.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Identificación */}
                  <td className="py-4 px-5 font-mono font-bold text-[#007B6D] whitespace-nowrap">
                    <span className="inline-block bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {item.identificacion}
                    </span>
                  </td>

                  {/* Nro. Traspaso */}
                  <td className="py-4 px-4 font-mono font-black text-gray-900 whitespace-nowrap">
                    {item.nroTraspaso}
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{item.fecha}</span>
                    </div>
                  </td>

                  {/* Origen */}
                  <td className="py-4 px-5 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                        <Building2 size={13} />
                      </div>
                      <span className="font-semibold text-gray-800">{item.origen}</span>
                    </div>
                  </td>

                  {/* Destino */}
                  <td className="py-4 px-5 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007B6D] flex items-center justify-center shrink-0">
                        <ArrowRight size={13} />
                      </div>
                      <span className="font-bold text-[#007B6D]">{item.destino}</span>
                    </div>
                  </td>

                  {/* Motivo */}
                  <td className="py-4 px-5 text-gray-600">
                    <p className="line-clamp-2 leading-relaxed">{item.motivo}</p>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {getEstadoBadge(item.estado)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer */}
      <div className="py-4 px-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span>Total transferencias registradas: <strong className="text-gray-900">{filteredData.length}</strong></span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition disabled:opacity-40" disabled>
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 py-1 rounded-lg bg-[#007B6D] text-white font-bold text-xs shadow-xs">
            1
          </span>
          <button className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition disabled:opacity-40" disabled>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraspasoSubAlmacenTable;
