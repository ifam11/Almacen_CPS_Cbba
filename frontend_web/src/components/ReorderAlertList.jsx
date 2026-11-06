/**
 * @file ReorderAlertList.jsx
 * @description Lista de insumos en Punto de Reorden o Quiebre de Stock (Stock mínimo).
 */

import React from 'react';
import { AlertCircle, ArrowDownCircle } from 'lucide-react';

const ReorderAlertList = ({ items }) => {
  const lista = items || [];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <AlertCircle size={20} color="var(--alert-amber)" />
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Puntos de Reorden y Quiebres de Stock
        </h3>
      </div>

      {lista.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
          ✅ Todos los insumos cuentan con saldo por encima del punto de reorden.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {lista.map(item => {
            const esCritico = item.estado_urgencia === 'QUIEBRE_CRITICO';
            return (
              <div
                key={item.id_insumo}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: esCritico ? '#FEF2F2' : '#FFFBEB',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${esCritico ? 'var(--alert-red)' : 'var(--alert-amber)'}`
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
                    {item.nombre}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Cód: {item.codigo_institucional} • Mínimo: {item.stock_minimo} | Reorden: {item.punto_reorden}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: esCritico ? 'var(--alert-red)' : 'var(--alert-amber)' }}>
                    {item.stock_actual} {item.unidad_medida}
                  </div>
                  <span className={`badge ${esCritico ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                    {esCritico ? 'QUIEBRE' : 'REORDEN'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReorderAlertList;
