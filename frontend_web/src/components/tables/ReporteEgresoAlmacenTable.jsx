/**
 * @file ReporteEgresoAlmacenTable.jsx
 * @description Tabla: Reporte de Egreso Almacén Central (Sección Informes/Reportes).
 * Columnas exactas: Nro.Egreso, Fecha, Servicio, Código, Descripción, Unidad, Cantidad, Lote, Vencimiento, Almacen.
 * Regla Estricta: Si la fecha está vencida, pintar el texto o badge en ROJO (#EF4444).
 */

import React, { useState } from 'react';
import {
  Search,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  Building,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';
import { mockReporteEgresoAlmacen } from '../../data/mockData';

const ReporteEgresoAlmacenTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [soloVencidos, setSoloVencidos] = useState(false);

  const filteredData = mockReporteEgresoAlmacen.filter(item => {
    const matchesSearch =
      item.nroEgreso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lote.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVencidos = soloVencidos ? item.esVencido : true;
    return matchesSearch && matchesVencidos;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden transition-all duration-200">
      {/* 1. Barra de Herramientas y Filtros */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#007B6D]">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Reporte de Egreso Almacén Central</span>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-[#007B6D] px-2 py-0.5 rounded-full border border-[#80CBC4]">
                  Auditoría FEFO
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Consolidado de dispensación por insumo, lote y fecha de vencimiento para auditoría médica
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
              placeholder="Buscar insumo, código, lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B6D] focus:bg-white transition"
            />
          </div>

          {/* Toggle Solo Lotes en Riesgo */}
          <button
            onClick={() => setSoloVencidos(!soloVencidos)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              soloVencidos
                ? 'bg-red-50 text-[#EF4444] border-red-300 shadow-xs'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle size={14} className={soloVencidos ? 'text-[#EF4444]' : 'text-gray-400'} />
            <span>{soloVencidos ? 'Filtrando Vencidos/Críticos' : 'Solo Lotes en Riesgo'}</span>
          </button>

          {/* Botón Imprimir / PDF */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 transition"
          >
            <Printer size={14} />
            <span>Imprimir</span>
          </button>

          {/* Botón Descargar */}
          <button
            onClick={() => alert('Generando informe consolidado en formato PDF oficial de la CPS...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007B6D] hover:bg-[#006459] text-white text-xs font-bold rounded-xl shadow-sm transition hover:shadow-md"
          >
            <Download size={14} />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#004D44] to-[#007B6D] text-white font-bold uppercase tracking-wider text-[11px] select-none">
              <th className="py-4 px-3 whitespace-nowrap">Nro.Egreso</th>
              <th className="py-4 px-3 whitespace-nowrap">Fecha</th>
              <th className="py-4 px-4 whitespace-nowrap">Servicio</th>
              <th className="py-4 px-3 whitespace-nowrap">Código</th>
              <th className="py-4 px-4 min-w-[220px]">Descripción</th>
              <th className="py-4 px-3 whitespace-nowrap">Unidad</th>
              <th className="py-4 px-3 whitespace-nowrap text-right">Cantidad</th>
              <th className="py-4 px-3 whitespace-nowrap">Lote</th>
              <th className="py-4 px-4 whitespace-nowrap text-center">Vencimiento</th>
              <th className="py-4 px-4 whitespace-nowrap">Almacen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-400 font-medium">
                  No existen registros para los criterios de filtro aplicados.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-50/40 transition-colors ${
                    item.esVencido ? 'bg-red-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Nro.Egreso */}
                  <td className="py-4 px-3 font-mono font-black text-[#007B6D]">
                    {item.nroEgreso}
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-3 text-gray-600 whitespace-nowrap">
                    {item.fecha}
                  </td>

                  {/* Servicio */}
                  <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                    {item.servicio}
                  </td>

                  {/* Código */}
                  <td className="py-4 px-3 font-mono font-bold text-gray-800 whitespace-nowrap">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] border border-gray-200">
                      {item.codigo}
                    </span>
                  </td>

                  {/* Descripción */}
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {item.descripcion}
                  </td>

                  {/* Unidad */}
                  <td className="py-4 px-3 text-gray-600 whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-gray-500">{item.unidad}</span>
                  </td>

                  {/* Cantidad */}
                  <td className="py-4 px-3 font-mono font-black text-gray-900 text-right whitespace-nowrap">
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">
                      {item.cantidad}
                    </span>
                  </td>

                  {/* Lote */}
                  <td className="py-4 px-3 font-mono text-gray-800 whitespace-nowrap">
                    <span className="font-semibold">{item.lote}</span>
                  </td>

                  {/* Vencimiento: Se resalta estrictamente en ROJO (#EF4444) si el lote está vencido/crítico */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {item.esVencido ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-[#EF4444] border border-red-300 shadow-xs animate-pulse">
                        <AlertTriangle size={12} className="text-[#EF4444]" />
                        <span>{item.vencimiento}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{item.vencimiento}</span>
                      </span>
                    )}
                  </td>

                  {/* Almacen */}
                  <td className="py-4 px-4 text-gray-700 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Building size={13} className="text-[#007B6D]" />
                      <span>{item.almacen}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer */}
      <div className="py-4 px-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>Total registros: <strong className="text-gray-900">{filteredData.length}</strong></span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
            <span>Rojo: Alerta de Caducidad / Riesgo Sanitario</span>
          </span>
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

export default ReporteEgresoAlmacenTable;
