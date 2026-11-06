/**
 * @file PedidosServicioEgresarTable.jsx
 * @description Tabla: Pedidos Servicio X Egresar - Almacén Central CPS Cochabamba.
 * Columnas exactas: Nro. Pedido, Fecha, Servicio, Estado, Grupo de Pedido.
 */

import React, { useState } from 'react';
import {
  Search,
  PackageCheck,
  AlertCircle,
  Clock,
  Truck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { mockPedidosServicioEgresar } from '../../data/mockData';

const PedidosServicioEgresarTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroUrgencia, setFiltroUrgencia] = useState('TODOS');

  const filteredData = mockPedidosServicioEgresar.filter(item => {
    const matchesSearch =
      item.nroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grupoPedido.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgencia =
      filtroUrgencia === 'TODOS' ? true : item.estado === filtroUrgencia;

    return matchesSearch && matchesUrgencia;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Urgente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-[#EF4444] border border-red-300 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
            URGENTE (Qx)
          </span>
        );
      case 'Por Despachar':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2F1] text-[#007B6D] border border-[#80CBC4]/60 shadow-xs">
            <Truck size={12} className="text-[#4DB6AC]" />
            Por Despachar
          </span>
        );
      case 'En Preparación':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            <Clock size={12} className="text-blue-600" />
            En Preparación
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

  const getGrupoTag = (grupo) => {
    if (grupo.includes('Quirúrgico') || grupo.includes('Anestesia')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (grupo.includes('Inyectables') || grupo.includes('Antibióticos')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (grupo.includes('Sueros') || grupo.includes('Soluciones')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden transition-all duration-200">
      {/* 1. Cabecera */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#007B6D]">
              <PackageCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Pedidos de Servicios Médicos por Egresar
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Cola de solicitudes clínicas asignadas a preparación física en pasillos de almacén
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nro. pedido o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B6D] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium border border-gray-200/60">
            {['TODOS', 'Urgente', 'Por Despachar', 'En Preparación'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroUrgencia(f)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filtroUrgencia === f
                    ? 'bg-white text-[#007B6D] font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f === 'TODOS' ? 'Todos' : f}
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
              <th className="py-4 px-5">Nro. Pedido</th>
              <th className="py-4 px-4">Fecha</th>
              <th className="py-4 px-5">Servicio</th>
              <th className="py-4 px-4 text-center">Estado</th>
              <th className="py-4 px-5">Grupo de Pedido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">
                  No se registran pedidos pendientes para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-50/40 transition-colors ${
                    item.estado === 'Urgente' ? 'bg-red-50/20' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Nro. Pedido */}
                  <td className="py-4 px-5 font-mono font-black text-[#007B6D] text-xs">
                    <span className="inline-block bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                      {item.nroPedido}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{item.fecha}</span>
                    </div>
                  </td>

                  {/* Servicio */}
                  <td className="py-4 px-5 font-bold text-gray-900 text-sm">
                    {item.servicio}
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4 text-center">
                    {getEstadoBadge(item.estado)}
                  </td>

                  {/* Grupo de Pedido */}
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${getGrupoTag(item.grupoPedido)}`}>
                      <Layers size={12} className="opacity-70" />
                      {item.grupoPedido}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer */}
      <div className="py-4 px-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span>Pedidos prioritarios en cola: <strong className="text-gray-900">{filteredData.length}</strong></span>
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

export default PedidosServicioEgresarTable;
