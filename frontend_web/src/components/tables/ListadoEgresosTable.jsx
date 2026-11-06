/**
 * @file ListadoEgresosTable.jsx
 * @description Tabla: Listado Egresos - Almacén Central CPS Cochabamba.
 * Columnas exactas: Identificación, Nro. Egreso, Servicio, Nro. Pedido, Fecha, Subalmacén, Estado.
 */

import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Building,
  Hash,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { mockListadoEgresos } from '../../data/mockData';

const ListadoEgresosTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  const filteredData = mockListadoEgresos.filter(item => {
    const matchesSearch =
      item.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nroEgreso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subalmacen.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === 'TODOS' || item.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2F1] text-[#007B6D] border border-[#80CBC4]/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC]"></span>
            Aprobado
          </span>
        );
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300/70 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pendiente
          </span>
        );
      case 'Rechazado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden transition-all duration-200">
      {/* 1. Barra de herramientas y filtros */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#007B6D]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Listado General de Egresos
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Despachos y salidas de inventario autorizadas para salas hospitalarias y policlínicos
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nro. egreso, servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B6D] focus:bg-white transition"
            />
          </div>

          {/* Filtro por estado con botones rápidos */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium border border-gray-200/60">
            {['TODOS', 'Aprobado', 'Pendiente', 'Rechazado'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterEstado(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterEstado === st
                    ? 'bg-white text-[#007B6D] font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'TODOS' ? 'Todos' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Generando planilla de egresos en formato Excel institucional...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007B6D] hover:bg-[#006459] text-white text-xs font-bold rounded-xl shadow-sm transition hover:shadow-md"
          >
            <Download size={14} />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#004D44] to-[#007B6D] text-white font-bold uppercase tracking-wider text-[11px] select-none">
              <th className="py-4 px-5">Identificación</th>
              <th className="py-4 px-4">Nro. Egreso</th>
              <th className="py-4 px-5">Servicio</th>
              <th className="py-4 px-4">Nro. Pedido</th>
              <th className="py-4 px-4">Fecha</th>
              <th className="py-4 px-5">Subalmacén</th>
              <th className="py-4 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileSpreadsheet size={32} className="text-gray-300" />
                    <p className="font-semibold text-sm text-gray-600">No se encontraron egresos coincidentes</p>
                    <p className="text-xs text-gray-400">Modifica los filtros o el término de búsqueda</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-50/40 transition-colors group ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Identificación */}
                  <td className="py-4 px-5 font-mono font-bold text-[#007B6D]">
                    <span className="inline-block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 group-hover:border-[#007B6D]">
                      {item.identificacion}
                    </span>
                  </td>

                  {/* Nro. Egreso */}
                  <td className="py-4 px-4 font-mono font-black text-gray-900">
                    {item.nroEgreso}
                  </td>

                  {/* Servicio */}
                  <td className="py-4 px-5 font-bold text-gray-900">
                    {item.servicio}
                  </td>

                  {/* Nro. Pedido */}
                  <td className="py-4 px-4 font-mono text-gray-600 font-medium">
                    {item.nroPedido}
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{item.fecha}</span>
                    </div>
                  </td>

                  {/* Subalmacén */}
                  <td className="py-4 px-5 font-semibold text-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Building size={13} className="text-gray-400" />
                      <span>{item.subalmacen}</span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4 text-center">
                    {getEstadoBadge(item.estado)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer con Paginación */}
      <div className="py-4 px-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Mostrando <strong className="text-gray-900 font-bold">{filteredData.length}</strong> de {mockListadoEgresos.length} egresos autorizados
        </div>

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

export default ListadoEgresosTable;
