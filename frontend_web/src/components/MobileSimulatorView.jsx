/**
 * @file MobileSimulatorView.jsx
 * @description Simulador interactivo en vivo de la App Móvil de Pasillo para Operarios CPS.
 * Permite previsualizar e interactuar directamente desde el navegador web con todas las pantallas
 * móviles: Login, Pasillo QR con Botón Gigante, Escáner con Láser y Detalle de Lote (FEFO/FIFO).
 * Colores institucionales: #007B6D (Verde CPS) y #FFFFFF (Blanco).
 */

import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Camera,
  CheckCircle2,
  Lock,
  User,
  ArrowRight,
  ExternalLink,
  Wifi,
  Battery,
  Layers,
  Sparkles
} from 'lucide-react';

const MobileSimulatorView = () => {
  // Estado de la pantalla dentro del teléfono simulado: 'login' | 'home' | 'scanner' | 'detail'
  const [screen, setScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('demo');

  // Datos simulados de lote y regla
  const [loteType, setLoteType] = useState('VALID_FEFO'); // 'VALID_FEFO' | 'INVALID_FEFO'
  const [qty, setQty] = useState(1);
  const [modalType, setModalType] = useState(null); // 'fefo_403' | 'success_kardex' | null

  const handleSimulateScan = (type) => {
    setLoteType(type);
    setScreen('detail');
    setModalType(null);
  };

  const handleConfirmDispatch = () => {
    if (loteType === 'INVALID_FEFO') {
      setModalType('fefo_403');
    } else {
      setModalType('success_kardex');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Banner Superior del Simulador */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#007B6D] flex items-center justify-center border border-[#80CBC4] shadow-xs shrink-0">
            <Smartphone size={30} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Simulador Móvil de Operarios de Pasillo
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#007B6D] border border-[#80CBC4]">
                Expo SDK 52 • Activo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Previsualización interactiva de la aplicación móvil de despacho con regla FEFO/FIFO, botón gigante y captura de errores HTTP 403.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#006459] to-[#007B6D] text-white rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            <ExternalLink size={14} />
            <span>Abrir en Servidor Metro (:8081)</span>
          </a>
        </div>
      </div>

      {/* 2. Área Central: Smartphone Bezel + Panel de Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Panel Izquierdo: Teléfono Inteligente Simulado */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
          <div className="w-[360px] h-[720px] bg-[#002B24] rounded-[48px] p-3.5 shadow-2xl border-4 border-gray-800 relative ring-8 ring-black/10 select-none">

            {/* Bocina / Isla dinámica y cámara frontal */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-700" />
            </div>

            {/* Pantalla del Teléfono */}
            <div className="w-full h-full bg-[#F0F4F3] rounded-[36px] overflow-hidden flex flex-col relative border border-black/20">

              {/* Status Bar */}
              <div className="bg-[#004D44] text-white pt-6 pb-2 px-6 flex items-center justify-between text-[11px] font-semibold">
                <span>09:41</span>
                <div className="flex items-center gap-2">
                  <Wifi size={12} />
                  <span>5G</span>
                  <Battery size={13} />
                </div>
              </div>

              {/* ======================================================== */}
              {/* PANTALLA 1: LOGIN SCREEN SIMULADO                        */}
              {/* ======================================================== */}
              {screen === 'login' && (
                <div className="flex-1 bg-[#004D44] p-5 flex flex-col justify-center animate-fadeIn text-white">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-white text-[#007B6D] text-2xl font-black flex items-center justify-center mx-auto mb-3 shadow-md ring-2 ring-[#80CBC4]">
                      ✚
                    </div>
                    <h3 className="text-base font-black tracking-wide">CAJA PETROLERA DE SALUD</h3>
                    <p className="text-[10px] text-[#80CBC4] font-bold tracking-widest">REGIONAL COCHABAMBA</p>
                    <p className="text-[11px] text-teal-100 mt-1">Módulo de Pasillo (Operarios)</p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 text-gray-900 shadow-lg space-y-3">
                    <div>
                      <label className="text-[10px] font-black text-[#004D44] uppercase">Correo Institucional</label>
                      <input
                        type="text"
                        readOnly
                        value="operario@cps.gob.bo"
                        className="w-full mt-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg font-mono text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#004D44] uppercase">Contraseña</label>
                      <input
                        type="password"
                        readOnly
                        value="Admin123*"
                        className="w-full mt-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                      />
                    </div>
                    <button
                      onClick={() => setScreen('home')}
                      className="w-full py-3 bg-[#007B6D] hover:bg-[#006459] text-white font-extrabold text-xs rounded-xl shadow-md transition"
                    >
                      INGRESAR AL SISTEMA
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-teal-200 mt-4 font-semibold">
                    Hospital Obrero N° 2 • Cochabamba
                  </p>
                </div>
              )}

              {/* ======================================================== */}
              {/* PANTALLA 2: HOME SCREEN SIMULADO                         */}
              {/* ======================================================== */}
              {screen === 'home' && (
                <div className="flex-1 flex flex-col bg-[#F0F4F3] animate-fadeIn">
                  {/* Top bar */}
                  <div className="bg-[#004D44] px-4 py-3 text-white flex items-center justify-between border-b border-[#006459]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white text-[#007B6D] flex items-center justify-center font-black text-sm">
                        ✚
                      </div>
                      <div>
                        <p className="text-[9px] font-extrabold text-[#80CBC4] uppercase">CPS COCHABAMBA</p>
                        <p className="text-xs font-bold leading-tight">Sr. Juan Mamani</p>
                        <p className="text-[9px] text-teal-200">ROL: OPERARIO PASILLO</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setScreen('login')}
                      className="text-[9px] bg-red-500/20 text-red-200 border border-red-400 px-2 py-1 rounded"
                    >
                      SALIR
                    </button>
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
                    {/* Banner Regla FEFO */}
                    <div className="bg-white rounded-xl p-3 border-l-4 border-[#007B6D] shadow-xs text-left">
                      <p className="text-[10px] font-black text-[#004D44]">🛡️ PROTOCOLO DE DESPACHO</p>
                      <p className="text-[10px] text-gray-600 mt-1 leading-tight">
                        • <strong>Sanitarios:</strong> FEFO (Caducidad más próxima).<br/>
                        • <strong>Administrativos:</strong> FIFO.<br/>
                        • <span className="text-red-600 font-bold">Bloqueo HTTP 403</span> ante infracción.
                      </p>
                    </div>

                    {/* BOTÓN GIGANTE ANIMADO */}
                    <div className="my-auto text-center py-4">
                      <div className="relative inline-block">
                        <div className="w-48 h-48 rounded-full bg-[#007B6D]/15 flex items-center justify-center animate-pulse mx-auto">
                          <div className="w-40 h-40 rounded-full bg-[#007B6D]/25 flex items-center justify-center">
                            <button
                              onClick={() => setScreen('scanner')}
                              className="w-34 h-34 rounded-full bg-[#007B6D] hover:bg-[#006459] text-white flex flex-col items-center justify-center shadow-xl shadow-teal-900/30 transition transform active:scale-95 border-4 border-[#80CBC4]"
                            >
                              <Camera size={34} className="mb-1 text-white" />
                              <span className="text-xs font-black tracking-wider">ESCANEAR QR</span>
                              <span className="text-[8px] text-[#80CBC4] font-bold">CÁMARA PASILLO</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-3 font-medium">
                        Presione el botón para activar la cámara
                      </p>
                    </div>

                    {/* Entrada manual */}
                    <div className="bg-white rounded-xl p-3 shadow-xs border border-gray-200">
                      <p className="text-[10px] font-bold text-gray-700">¿Etiqueta dañada?</p>
                      <div className="flex gap-1.5 mt-1.5">
                        <input
                          type="text"
                          readOnly
                          value="CPS-LOT-1-DEMO-VALID-FEFO"
                          className="flex-1 text-[10px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono truncate"
                        />
                        <button
                          onClick={() => handleSimulateScan('VALID_FEFO')}
                          className="bg-[#007B6D] text-white text-[10px] font-bold px-2.5 py-1.5 rounded"
                        >
                          BUSCAR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* PANTALLA 3: SCANNER SCREEN SIMULADO                      */}
              {/* ======================================================== */}
              {screen === 'scanner' && (
                <div className="flex-1 bg-black text-white p-4 flex flex-col justify-between animate-fadeIn relative">
                  <div className="flex items-center justify-between z-20">
                    <button
                      onClick={() => setScreen('home')}
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                    <span className="text-xs font-black tracking-wide text-white">ESCÁNER DE LOTE</span>
                    <div className="w-8 h-8 rounded-full bg-[#007B6D] flex items-center justify-center text-xs">
                      💡
                    </div>
                  </div>

                  {/* Visor de escáner simulado con láser */}
                  <div className="my-auto flex flex-col items-center z-10">
                    <div className="w-56 h-56 border-2 border-dashed border-[#80CBC4]/60 rounded-2xl relative flex items-center justify-center overflow-hidden bg-emerald-950/20">
                      {/* Esquinas */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#80CBC4] rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#80CBC4] rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#80CBC4] rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#80CBC4] rounded-br" />

                      {/* Línea láser animada */}
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#007B6D] to-transparent shadow-[0_0_12px_#007B6D] animate-bounce" />

                      <QrCode size={90} className="text-white/25 absolute" />
                    </div>
                    <p className="text-[10px] text-teal-200 mt-3 font-semibold bg-black/60 px-3 py-1 rounded-full">
                      Apunte al código QR del lote físico
                    </p>
                  </div>

                  {/* Botones de simulación directa */}
                  <div className="bg-black/80 p-3 rounded-xl border border-teal-900/60 z-20 space-y-1.5">
                    <p className="text-[9px] text-[#80CBC4] font-bold text-center uppercase">
                      Probar lectura de código QR:
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSimulateScan('VALID_FEFO')}
                        className="flex-1 py-2 bg-[#007B6D] hover:bg-[#006459] text-white text-[10px] font-bold rounded-lg shadow"
                      >
                        ✓ Lote Correcto (FEFO)
                      </button>
                      <button
                        onClick={() => handleSimulateScan('INVALID_FEFO')}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shadow"
                      >
                        ⛔ Infringe FEFO (403)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* PANTALLA 4: DETAIL SCREEN SIMULADO                       */}
              {/* ======================================================== */}
              {screen === 'detail' && (
                <div className="flex-1 bg-[#F0F4F3] flex flex-col justify-between overflow-y-auto animate-fadeIn relative">
                  {/* Header */}
                  <div className="bg-[#004D44] px-4 py-2.5 text-white flex items-center justify-between">
                    <button
                      onClick={() => setScreen('home')}
                      className="text-xs text-[#80CBC4] font-bold"
                    >
                      ← Volver
                    </button>
                    <p className="text-xs font-black">DESPACHO DE LOTE</p>
                    <div className="w-8" />
                  </div>

                  <div className="p-3.5 space-y-3">
                    {/* Badge FEFO */}
                    <div className="bg-red-50 border border-red-200 p-2 rounded-lg text-[10px] text-red-700 font-extrabold flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>INSUMO SANITARIO: ROTACIÓN FEFO OBLIGATORIA</span>
                    </div>

                    {/* Tarjeta del Insumo */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#007B6D] font-mono">MED-AMOX-500</span>
                        <span className="text-[9px] bg-teal-50 text-[#007B6D] font-extrabold px-2 py-0.5 rounded">FÁRMACO</span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900 leading-tight">Amoxicilina 500mg</h4>
                      <p className="text-[10px] text-gray-500">Caja x 100 Cápsulas</p>
                      <hr className="border-gray-100" />
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <p className="text-gray-400 font-bold">N° LOTE:</p>
                          <p className="font-bold text-gray-800">
                            {loteType === 'VALID_FEFO' ? 'LOT-2026-A1' : 'LOT-2026-B9 (Más nuevo)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold">VENCIMIENTO:</p>
                          <p className="font-black text-red-600">
                            {loteType === 'VALID_FEFO' ? '15/11/2026 (Próximo)' : '30/08/2027'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold">DISPONIBLE:</p>
                          <p className="font-bold text-[#007B6D]">120 unidades</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold">UBICACIÓN:</p>
                          <p className="font-bold text-gray-700">📍 Pasillo 2, Estante B</p>
                        </div>
                      </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-200 space-y-2.5">
                      <label className="text-[10px] font-bold text-gray-700">Cantidad a despachar:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-8 h-8 rounded-lg bg-teal-50 text-[#004D44] font-black text-base border border-[#80CBC4]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={qty}
                          readOnly
                          className="w-16 h-8 text-center bg-gray-50 border border-gray-300 rounded-lg font-bold text-xs"
                        />
                        <button
                          onClick={() => setQty(qty + 1)}
                          className="w-8 h-8 rounded-lg bg-teal-50 text-[#004D44] font-black text-base border border-[#80CBC4]"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setQty(120)}
                          className="px-2.5 h-8 rounded-lg bg-[#007B6D] text-white text-[10px] font-bold"
                        >
                          MÁX
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-700">Servicio de Destino:</label>
                        <input
                          type="text"
                          readOnly
                          value="Quirófano 1 - Cirugía General"
                          className="w-full mt-1 text-[10px] p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                        />
                      </div>

                      <button
                        onClick={handleConfirmDispatch}
                        className="w-full py-3 bg-[#007B6D] hover:bg-[#006459] text-white font-black text-xs rounded-xl shadow-md transition"
                      >
                        VALIDAR Y CONFIRMAR
                      </button>
                    </div>
                  </div>

                  {/* MODAL FEFO 403 INTERACTIVO */}
                  {modalType === 'fefo_403' && (
                    <div className="absolute inset-0 bg-black/75 z-50 p-4 flex items-center justify-center">
                      <div className="bg-white rounded-2xl p-4 w-full max-h-[90%] border-2 border-red-500 shadow-2xl text-center space-y-2">
                        <span className="text-3xl">⛔</span>
                        <h4 className="text-sm font-black text-red-700">¡DESPACHO BLOQUEADO!</h4>
                        <p className="text-[9px] font-bold text-red-600 bg-red-50 py-0.5 rounded">
                          HTTP 403 FORBIDDEN - REGLA FEFO
                        </p>
                        <p className="text-[10px] text-gray-600 text-left">
                          Existe un lote con fecha de caducidad más próxima que debe ser retirado primero:
                        </p>
                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-left text-[10px]">
                          <p className="font-black text-[#007B6D]">Lote Obligatorio: LOT-2026-A1</p>
                          <p className="text-gray-600">Vence: 15/11/2026 (Stock: 45 uds)</p>
                          <p className="text-[#004D44] font-bold mt-1">📍 Pasillo 2, Estante A, Nivel 1</p>
                        </div>
                        <button
                          onClick={() => setModalType(null)}
                          className="w-full py-2 bg-[#007B6D] text-white text-[10px] font-black rounded-lg"
                        >
                          ENTENDIDO, BUSCARÉ LOTE OBLIGATORIO
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODAL ÉXITO KARDEX */}
                  {modalType === 'success_kardex' && (
                    <div className="absolute inset-0 bg-black/75 z-50 p-4 flex items-center justify-center">
                      <div className="bg-white rounded-2xl p-4 w-full shadow-2xl text-center space-y-2.5">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                          ✓
                        </div>
                        <h4 className="text-sm font-black text-gray-900">¡Despacho Confirmado!</h4>
                        <p className="text-[10px] text-gray-500">Kardex Inmutable Registrado #KDX-8921</p>
                        <div className="bg-gray-50 p-2.5 rounded-lg text-[10px] text-left space-y-1">
                          <p><strong>Cant. Despachada:</strong> {qty} unidades</p>
                          <p><strong>Saldo Restante:</strong> {120 - qty} unidades</p>
                          <p className="text-emerald-700 font-bold">Cumplimiento FEFO: 100% OK</p>
                        </div>
                        <button
                          onClick={() => {
                            setModalType(null);
                            setScreen('home');
                          }}
                          className="w-full py-2 bg-[#007B6D] text-white text-[10px] font-black rounded-lg"
                        >
                          ESCANEAR SIGUIENTE INSUMO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* PANTALLA 5: SIGMAT IA PREDICCIONES SIMULADO              */}
              {/* ======================================================== */}
              {screen === 'ai' && (
                <div className="flex-1 bg-[#F1F5F9] flex flex-col justify-between overflow-y-auto animate-fadeIn">
                  {/* Header */}
                  <div className="bg-[#004D44] px-4 py-2.5 text-white flex items-center justify-between">
                    <button
                      onClick={() => setScreen('home')}
                      className="text-xs text-[#80CBC4] font-bold hover:underline"
                    >
                      ← Volver
                    </button>
                    <p className="text-xs font-black">SIGMAT IA • ROP (+15% SS)</p>
                    <span className="text-xs">🧠</span>
                  </div>

                  <div className="p-3 space-y-2.5">
                    {/* Banner IA */}
                    <div className="bg-[#007B6D] text-white p-3 rounded-xl shadow-xs text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🧠</span>
                        <div>
                          <p className="text-[11px] font-black">Random Forest Regressor (Scikit-Learn)</p>
                          <p className="text-[9px] text-teal-200">Precisión R²: 94.2% • MAPE: 5.8% • Margen SS: 15%</p>
                        </div>
                      </div>
                    </div>

                    {/* Alerta Quiebre Crítico */}
                    <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-red-700">🚨 QUIEBRE CRÍTICO DETECTADO</span>
                        <span className="text-[9px] bg-red-200 text-red-900 font-extrabold px-1.5 py-0.5 rounded">Stock 0</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-900 mt-1">Tóner HP LaserJet 85A</p>
                      <p className="text-[9px] text-gray-600">Demanda Mes: 45 unid • ROP Sugerido: 52 unid (+15% SS)</p>
                      <button
                        onClick={() => alert('Punto de Reorden ajustado a 52 unidades (+15% SS) en MySQL')}
                        className="mt-2 w-full py-1 bg-[#007B6D] hover:bg-[#006459] text-white text-[9px] font-bold rounded transition shadow-xs"
                      >
                        💾 GUARDAR ROP (52) EN MYSQL
                      </button>
                    </div>

                    {/* Insumo 2 */}
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-800">⚠️ REORDEN URGENTE</span>
                        <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">Stock 50</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-900 mt-1">Papel Bond Carta 75g</p>
                      <p className="text-[9px] text-gray-600">Demanda Mes: 180 unid • ROP Sugerido: 207 unid (+15% SS)</p>
                      <button
                        onClick={() => alert('Punto de Reorden ajustado a 207 unidades (+15% SS) en MySQL')}
                        className="mt-2 w-full py-1 bg-[#007B6D] hover:bg-[#006459] text-white text-[9px] font-bold rounded transition shadow-xs"
                      >
                        💾 GUARDAR ROP (207) EN MYSQL
                      </button>
                    </div>

                    {/* Insumo 3 Sanitario FEFO */}
                    <div className="bg-white border border-gray-200 p-2.5 rounded-xl text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-700">🩺 FEFO SANITARIO ÓPTIMO</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">Stock 850</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-900 mt-1">Amoxicilina 500mg</p>
                      <p className="text-[9px] text-gray-600">Demanda Mes: 245.5 unid • ROP Sugerido: 283 unid</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Barra de Navegación Inferior Móvil */}
              <div className="bg-[#004D44] py-1.5 px-4 flex items-center justify-around border-t border-[#006459] text-white text-[9px] font-bold">
                <button
                  onClick={() => setScreen('home')}
                  className={`flex flex-col items-center py-0.5 px-2 rounded-lg transition ${
                    screen === 'home' ? 'text-white bg-white/20 font-black' : 'text-teal-200 hover:text-white'
                  }`}
                >
                  <span className="text-xs">🏠</span>
                  <span>Pasillo</span>
                </button>

                <button
                  onClick={() => setScreen('scanner')}
                  className="w-9 h-9 rounded-full bg-[#007B6D] -mt-3 border-2 border-[#80CBC4] flex items-center justify-center text-xs shadow-md"
                >
                  📷
                </button>

                <button
                  onClick={() => setScreen('ai')}
                  className={`flex flex-col items-center py-0.5 px-2 rounded-lg transition ${
                    screen === 'ai' ? 'text-white bg-white/20 font-black' : 'text-teal-200 hover:text-white'
                  }`}
                >
                  <span className="text-xs">🧠</span>
                  <span>SIGMAT IA</span>
                </button>
              </div>

              {/* Botón Home Virtual en el borde inferior */}
              <div className="bg-[#F0F4F3] py-1.5 flex justify-center border-t border-gray-200">
                <button
                  onClick={() => setScreen('home')}
                  className="w-24 h-1 bg-gray-400 rounded-full hover:bg-gray-600 transition"
                  title="Volver a Inicio Móvil"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Guía y Controles de Demostración */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          {/* Tarjeta de Instrucciones */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-gray-900">
              <Sparkles size={18} className="text-[#007B6D]" />
              <span>Controles Rápidos del Simulador Móvil</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Utilice los siguientes accesos directos para probar instantáneamente los tres flujos críticos del operario de almacén en el teléfono de la izquierda:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setScreen('login')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  screen === 'login' ? 'border-[#007B6D] bg-teal-50/50 ring-2 ring-[#007B6D]' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#007B6D]" />
                  <span className="text-xs font-bold text-gray-900">1. Pantalla de Login</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Autenticación institucional de operarios y captura de rol RBAC.
                </p>
              </button>

              <button
                onClick={() => setScreen('home')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  screen === 'home' ? 'border-[#007B6D] bg-teal-50/50 ring-2 ring-[#007B6D]' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-[#007B6D]" />
                  <span className="text-xs font-bold text-gray-900">2. Menú de Pasillo</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Botón gigante animado para activación de cámara de escaneo QR.
                </p>
              </button>

              <button
                onClick={() => handleSimulateScan('VALID_FEFO')}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-left transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">3. Probar Lote FEFO Válido</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Despacha el lote con caducidad más cercana y genera Kardex inmutable.
                </p>
              </button>

              <button
                onClick={() => {
                  handleSimulateScan('INVALID_FEFO');
                  setTimeout(() => setModalType('fefo_403'), 400);
                }}
                className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 text-left transition"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-xs font-bold text-red-900">4. Probar Bloqueo HTTP 403</span>
                </div>
                <p className="text-[11px] text-red-700 mt-1">
                  Intenta sacar un lote más nuevo cuando hay uno viejo. Bloquea el despacho.
                </p>
              </button>

              <button
                onClick={() => setScreen('ai')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  screen === 'ai' ? 'border-[#007B6D] bg-teal-50/50 ring-2 ring-[#007B6D]' : 'border-teal-200 bg-teal-50/20 hover:bg-teal-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🧠</span>
                  <span className="text-xs font-bold text-[#007B6D]">5. Probar Módulo IA Móvil</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Predicciones Random Forest, alertas de rotura y ajuste de ROP (+15% SS).
                </p>
              </button>
            </div>
          </div>

          {/* Información Técnica de la Aplicación Móvil */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Arquitectura de la App Móvil React Native
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Framework:</span>
                <span className="font-mono font-bold text-gray-800">React Native 0.76 + Expo SDK 52</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Lector de Cámara:</span>
                <span className="font-mono font-bold text-gray-800">expo-camera (Escaneo QR de pasillo)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Validación de Negocio:</span>
                <span className="font-bold text-[#007B6D]">FEFO Sanitario & FIFO Administrativo</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-gray-500">Servidor Bundler:</span>
                <a
                  href="http://localhost:8081"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-[#007B6D] hover:underline"
                >
                  http://localhost:8081 (Metro Web & Expo Go)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSimulatorView;
