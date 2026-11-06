/**
 * @file TraspasoVencidosTable.jsx
 * @description Tabla: Traspaso Vencidos - Almacén Central CPS Cochabamba.
 * Columnas exactas: Almacén de Origen, Lotes Vencidos, Total Unidades Vencidas, Acción.
 * Acciones: Botón para "Ver detalles" o "Ejecutar Traspaso".
 */

import React, { useState } from 'react';
import {
  AlertOctagon,
  Eye,
  Send,
  MapPin,
  ShieldAlert,
  X,
  FileCheck,
  Building,
  CheckCircle2,
  Trash2,
  Calendar
} from 'lucide-react';
import { mockTraspasoVencidos } from '../../data/mockData';

const TraspasoVencidosTable = () => {
  const [data, setData] = useState(mockTraspasoVencidos);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const handleEjecutarTraspaso = (id, origen, lotes, unidades) => {
    if (window.confirm(`¿Confirma ejecutar el traspaso formal a Cuarentena/Baja médica para los lotes vencidos de:\n"${origen}"?`)) {
      setData(prev => prev.map(item =>
        item.id === id ? { ...item, estadoBaja: 'Traspaso a Cuarentena Ejecutado' } : item
      ));
      setSuccessToast(`Traspaso a Cuarentena ejecutado con éxito para ${origen}. Se emitió el acta de custodia sanitaria.`);
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden transition-all duration-200">
      {/* Toast de Éxito Flotante */}
      {successToast && (
        <div className="bg-[#007B6D] text-white px-5 py-3 text-xs font-bold flex items-center justify-between border-b border-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#80CBC4]" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-200 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Cabecera */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-[#EF4444]">
              <AlertOctagon size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Control y Traspaso de Lotes Vencidos</span>
                <span className="text-[10px] font-extrabold uppercase bg-red-100 text-[#EF4444] px-2 py-0.5 rounded-full border border-red-300">
                  Cuarentena Inmediata
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Aislamiento sanitario obligatorio de medicamentos y suministros caducados para disposición final
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 text-[#EF4444] border border-red-200/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
            </span>
            <span>Protocolo de Bioseguridad Farmacéutica</span>
          </div>
        </div>
      </div>

      {/* 2. Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#004D44] to-[#007B6D] text-white font-bold uppercase tracking-wider text-[11px] select-none">
              <th className="py-4 px-5 min-w-[260px]">Almacén de Origen</th>
              <th className="py-4 px-5 min-w-[300px]">Lotes Vencidos</th>
              <th className="py-4 px-4 text-center whitespace-nowrap">Total Unidades Vencidas</th>
              <th className="py-4 px-5 text-center whitespace-nowrap">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 font-medium">
                  Excelente: No se registran lotes vencidos pendientes de traspaso.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-red-50/20 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Almacén de Origen */}
                  <td className="py-4 px-5 font-bold text-gray-900">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007B6D] mt-0.5 shrink-0">
                        <MapPin size={15} />
                      </div>
                      <div>
                        <span className="text-sm text-gray-900 font-extrabold">{item.almacenOrigen}</span>
                        <div className="text-[11px] font-normal text-gray-500 mt-0.5">
                          Estado:{' '}
                          <span className={`font-bold ${item.estadoBaja.includes('Ejecutado') ? 'text-[#007B6D]' : 'text-amber-700'}`}>
                            {item.estadoBaja}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Lotes Vencidos */}
                  <td className="py-4 px-5 font-mono text-gray-800">
                    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200/90 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                      <AlertOctagon size={13} className="text-[#EF4444]" />
                      <span>{item.lotesVencidos}</span>
                    </div>
                  </td>

                  {/* Total Unidades Vencidas */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-red-100 text-[#EF4444] border border-red-300 shadow-xs">
                      {item.totalUnidadesVencidas} unidades
                    </span>
                  </td>

                  {/* Acción: Botón para "Ver detalles" o "Ejecutar Traspaso" */}
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-300/80 transition hover:shadow-xs"
                        title="Ver ficha técnica sanitaria del lote"
                      >
                        <Eye size={13} />
                        <span>Ver detalles</span>
                      </button>

                      <button
                        onClick={() => handleEjecutarTraspaso(item.id, item.almacenOrigen, item.lotesVencidos, item.totalUnidadesVencidas)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EF4444] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition hover:shadow-sm"
                        title="Ejecutar aislamiento sanitario y remisión a depósito de mermas"
                      >
                        <Send size={13} />
                        <span>Ejecutar Traspaso</span>
                      </button>
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
        <span>Dependencias hospitalarias con mermas: <strong className="text-gray-900">{data.length}</strong></span>
        <span className="text-[11px] text-gray-400">Ley del Medicamento y Normativa de Custodia CPS</span>
      </div>

      {/* 4. Modal Interactivo de Ficha Técnica de Lote */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-t-4 border-[#EF4444] relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center">
                <AlertOctagon size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Ficha Técnica Sanitaria de Lote Vencido
                </h3>
                <p className="text-xs text-gray-500">
                  Expediente de baja para remisión a auditoría médica
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
              <div className="flex justify-between items-center py-1 border-b border-gray-200/80">
                <span className="font-bold text-gray-600">Almacén de Origen:</span>
                <span className="font-extrabold text-gray-900">{selectedItem.almacenOrigen}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/80">
                <span className="font-bold text-gray-600">Lotes Involucrados:</span>
                <span className="font-mono font-black text-[#EF4444]">{selectedItem.lotesVencidos}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/80">
                <span className="font-bold text-gray-600">Total Unidades:</span>
                <span className="font-black text-red-700 text-sm">{selectedItem.totalUnidadesVencidas} unidades</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/80">
                <span className="font-bold text-gray-600">Destino de Disposición:</span>
                <span className="font-bold text-gray-800">Depósito de Cuarentena (Piso -1)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-bold text-gray-600">Estado de Tramitación:</span>
                <span className="font-extrabold text-amber-700">{selectedItem.estadoBaja}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
              >
                Cerrar Ficha
              </button>
              <button
                onClick={() => {
                  handleEjecutarTraspaso(selectedItem.id, selectedItem.almacenOrigen, selectedItem.lotesVencidos, selectedItem.totalUnidadesVencidas);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-[#EF4444] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Ejecutar Traspaso Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraspasoVencidosTable;
