/**
 * @file GrafanaEmbed.jsx
 * @description Componente corporativo reutilizable para embeber tableros analíticos de Grafana
 * en tiempo real para la Caja Petrolera de Salud (CPS).
 * Estilo visual integrado con el tema institucional CPS (#007B6D, #F0F4F3 y blanco).
 * Soporta control de rangos de tiempo, auto-refresco, modo Kiosk, cambio de tema Claro/Oscuro y enlace directo.
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Maximize2,
  Minimize2,
  ExternalLink,
  RefreshCw,
  Clock,
  Radio,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

const GrafanaEmbed = ({
  dashboardUid = 'cps-almacen-operativo',
  title = 'Monitoreo en Tiempo Real (Grafana)',
  subtitle = 'Telemetría de Inventarios, Lotes FEFO/FIFO y Métricas de Auditoría',
  defaultTimeRange = 'now-30d',
  height = '820px',
  theme = 'light'
}) => {
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [refreshInterval, setRefreshInterval] = useState('10s');
  const [currentTheme, setCurrentTheme] = useState(theme); // 'light' | 'dark'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kioskMode, setKioskMode] = useState('tv'); // 'tv' oculta barra sup de Grafana; '' muestra completo
  const [grafanaOnline, setGrafanaOnline] = useState(null); // null = verificando, true, false
  const [iframeKey, setIframeKey] = useState(Date.now());

  const grafanaBaseUrl = 'http://localhost:3001';

  // Verificar si Grafana está respondiendo en el puerto 3001
  useEffect(() => {
    let isMounted = true;
    const checkGrafanaHealth = async () => {
      try {
        const res = await fetch(`${grafanaBaseUrl}/api/health`, { method: 'GET', mode: 'no-cors' });
        if (isMounted) setGrafanaOnline(true);
      } catch (err) {
        if (isMounted) setGrafanaOnline(false);
      }
    };

    checkGrafanaHealth();
    const interval = setInterval(checkGrafanaHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Construir URL del iFrame con parámetros de Grafana
  const buildGrafanaUrl = () => {
    const params = new URLSearchParams();
    params.set('orgId', '1');
    params.set('from', timeRange);
    params.set('to', 'now');
    params.set('refresh', refreshInterval);
    params.set('theme', currentTheme);
    if (kioskMode) {
      params.set('kiosk', kioskMode);
    }
    return `${grafanaBaseUrl}/d/${dashboardUid}?${params.toString()}`;
  };

  const handleRefresh = () => {
    setIframeKey(Date.now());
  };

  const directDashboardUrl = `${grafanaBaseUrl}/d/${dashboardUid}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-teal-200/80 shadow-card overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen bg-[#F0F4F3]' : ''
      }`}
    >
      {/* Barra de Controles y Cabecera del Componente Integrada al Estilo CPS */}
      <div className="bg-gradient-to-r from-[#004D44] via-[#007B6D] to-[#004D44] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#004D44]/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-teal-100 shadow-inner">
            <Activity className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-wide">{title}</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 border border-white/30 text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                Grafana v10
              </span>
              {grafanaOnline === true && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-900/60 border border-emerald-400/50 text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> MySQL CPS Conectado
                </span>
              )}
            </div>
            <p className="text-xs text-teal-100/90 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Controles de Rango de Tiempo, Auto-Refresco y Acciones */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Selector de Rango */}
          <div className="flex items-center gap-1 bg-black/20 border border-white/20 rounded-xl p-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-teal-200 ml-1.5 mr-0.5" />
            <button
              onClick={() => setTimeRange('now-24h')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                timeRange === 'now-24h' ? 'bg-white text-[#007B6D] shadow-sm' : 'text-teal-100 hover:text-white'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('now-7d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                timeRange === 'now-7d' ? 'bg-white text-[#007B6D] shadow-sm' : 'text-teal-100 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange('now-30d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                timeRange === 'now-30d' ? 'bg-white text-[#007B6D] shadow-sm' : 'text-teal-100 hover:text-white'
              }`}
            >
              30 Días
            </button>
          </div>

          {/* Selector de Intervalo de Refresco */}
          <div className="flex items-center gap-1 bg-black/20 border border-white/20 rounded-xl p-1 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-300 ml-1.5 mr-0.5" />
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="5s" className="bg-[#004D44] text-white">5s</option>
              <option value="10s" className="bg-[#004D44] text-white">10s</option>
              <option value="30s" className="bg-[#004D44] text-white">30s</option>
              <option value="1m" className="bg-[#004D44] text-white">1m</option>
              <option value="" className="bg-[#004D44] text-white">Pausar</option>
            </select>
          </div>

          {/* Toggle Tema Claro / Oscuro */}
          <button
            onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
            title={currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro institucional'}
            className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 border border-white/20 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white transition"
          >
            {currentTheme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-teal-200" />
                <span className="hidden sm:inline">Oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Claro</span>
              </>
            )}
          </button>

          {/* Toggle Modo Kiosk / Interactivo */}
          <button
            onClick={() => setKioskMode(kioskMode === 'tv' ? '' : 'tv')}
            title="Alternar vista limpia (Kiosk) / Controles completos de Grafana"
            className="flex items-center gap-1 bg-black/20 hover:bg-black/30 border border-white/20 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-200" />
            <span className="hidden sm:inline">{kioskMode ? 'Modo Limpio' : 'Modo Editor'}</span>
          </button>

          {/* Botón de Refresco Manual */}
          <button
            onClick={handleRefresh}
            title="Recargar paneles de Grafana"
            className="p-1.5 bg-black/20 hover:bg-black/30 border border-white/20 text-white rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Botón Abrir en Grafana Studio */}
          <a
            href={directDashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir este dashboard en Grafana independiente"
            className="flex items-center gap-1 bg-white hover:bg-teal-50 text-[#007B6D] px-3 py-1.5 rounded-xl text-xs font-extrabold transition shadow-sm"
          >
            <span>Grafana Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Botón Pantalla Completa */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
            className="p-1.5 bg-black/20 hover:bg-black/30 border border-white/20 text-white rounded-xl transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Contenedor del iFrame de Grafana con fondo acoplado al sistema (#F0F4F3) */}
      <div
        className="w-full relative bg-[#F0F4F3]"
        style={{ height: isFullscreen ? 'calc(100vh - 60px)' : height }}
      >
        <iframe
          key={`${iframeKey}-${timeRange}-${refreshInterval}-${kioskMode}-${currentTheme}`}
          src={buildGrafanaUrl()}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full border-none shadow-inner"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />

        {/* Banner sutil inferior institucional con información de origen */}
        <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none opacity-90 hover:opacity-100 transition">
          <span className="bg-white/95 text-gray-700 text-[11px] px-3 py-1 rounded-lg border border-teal-200/90 shadow-sm backdrop-blur-sm flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Base de Datos: <span className="text-[#007B6D] font-mono font-bold">MySQL 8 • almacen_cps</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GrafanaEmbed;
