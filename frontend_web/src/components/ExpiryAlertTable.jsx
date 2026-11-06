/**
 * @file ExpiryAlertTable.jsx
 * @description Tabla de monitoreo semafórico de caducidad: Alerta Roja (<30 días) y Alerta Amarilla (<60 días).
 */

import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, QrCode, ShieldAlert, Sparkles } from 'lucide-react';

const ExpiryAlertTable = ({ semaforoData, onVerQr, onPredecirIa }) => {
  const [activeTab, setActiveTab] = useState('ROJA'); // 'ROJA' | 'AMARILLA' | 'TODAS'

  const alertaRoja = semaforoData?.alerta_roja?.lotes || [];
  const alertaAmarilla = semaforoData?.alerta_amarilla?.lotes || [];

  const getListaActual = () => {
    if (activeTab === 'ROJA') return alertaRoja;
    if (activeTab === 'AMARILLA') return alertaAmarilla;
    return [...alertaRoja, ...alertaAmarilla];
  };

  const lotesMostrados = getListaActual();

  return (
    <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
      {/* Encabezado y Pestañas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={22} color="var(--alert-red)" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Semáforo de Caducidad y Riesgo Sanitario
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Monitoreo preventivo para evitar mermas farmacéuticas y garantizar la rotación FEFO obligatoria
          </p>
        </div>

        {/* Selector de Pestañas Semafóricas */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('ROJA')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'ROJA' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'ROJA' ? 'var(--alert-red)' : 'var(--text-muted)',
              boxShadow: activeTab === 'ROJA' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <span className="pulse-dot-red" />
            Alerta Roja ({alertaRoja.length}) &lt;30d
          </button>

          <button
            onClick={() => setActiveTab('AMARILLA')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'AMARILLA' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'AMARILLA' ? 'var(--alert-amber)' : 'var(--text-muted)',
              boxShadow: activeTab === 'AMARILLA' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <span className="pulse-dot-amber" />
            Alerta Amarilla ({alertaAmarilla.length}) &lt;60d
          </button>

          <button
            onClick={() => setActiveTab('TODAS')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: activeTab === 'TODAS' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'TODAS' ? 'var(--cps-navy)' : 'var(--text-muted)',
              boxShadow: activeTab === 'TODAS' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Todos ({alertaRoja.length + alertaAmarilla.length})
          </button>
        </div>
      </div>

      {/* Tabla Semafórica */}
      <div className="table-responsive">
        <table className="cps-table">
          <thead>
            <tr>
              <th>ESTADO SEMAFÓRICO</th>
              <th>INSUMO MÉDICO / ARTÍCULO</th>
              <th>N° LOTE / CÓDIGO QR</th>
              <th>ROTACIÓN</th>
              <th>FECHA VENCIMIENTO</th>
              <th>SALDO FÍSICO</th>
              <th>VALOR EN RIESGO</th>
              <th>UBICACIÓN EN PASILLO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {lotesMostrados.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  ✅ No existen lotes en este nivel de alerta. El inventario se encuentra dentro de los márgenes seguros.
                </td>
              </tr>
            ) : (
              lotesMostrados.map((lote) => {
                const esRoja = lote.dias_restantes <= 30;
                const estaVencido = lote.dias_restantes < 0;

                return (
                  <tr key={lote.id_lote} style={{ backgroundColor: esRoja ? 'rgba(254, 242, 242, 0.4)' : 'transparent' }}>
                    <td>
                      <span className={`badge ${esRoja ? 'badge-red' : 'badge-amber'}`}>
                        {esRoja ? <span className="pulse-dot-red" /> : <span className="pulse-dot-amber" />}
                        {estaVencido ? 'CADUCADO' : `${lote.dias_restantes} días rest.`}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {lote.insumo?.nombre || 'Insumo'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--cps-blue)', fontWeight: '600' }}>
                        {lote.insumo?.codigo_institucional}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{lote.numero_lote}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} title={lote.codigo_qr}>
                        {lote.codigo_qr ? lote.codigo_qr.substring(0, 18) + '...' : '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${lote.insumo?.tipo === 'SANITARIO' ? 'badge-red' : 'badge-blue'}`}>
                        {lote.insumo?.tipo === 'SANITARIO' ? 'FEFO OBLIGATORIO' : 'FIFO'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: esRoja ? 'var(--alert-red)' : 'var(--alert-amber)' }}>
                        {lote.fecha_vencimiento}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>
                        {lote.cantidad_actual}
                      </span>{' '}
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {lote.insumo?.unidad_medida || 'uds'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        Bs. {lote.valor_total_lote?.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                        <MapPin size={13} color="var(--cps-blue)" />
                        {lote.ubicacion_pasillo || 'Sin asignar'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                          onClick={() => onVerQr && onVerQr(lote)}
                          title="Ver código QR para escaneo o reimpresión"
                        >
                          <QrCode size={13} />
                          QR
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#0284C7' }}
                          onClick={() => onPredecirIa && onPredecirIa(lote.insumo)}
                          title="Calcular pronóstico de demanda y punto de reorden con IA"
                        >
                          <Sparkles size={13} />
                          IA
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiryAlertTable;
