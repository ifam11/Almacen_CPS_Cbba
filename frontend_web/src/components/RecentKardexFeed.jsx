/**
 * @file RecentKardexFeed.jsx
 * @description Registro en tiempo real de movimientos inmutables de Kardex (Ingresos, Despachos).
 */

import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentKardexFeed = ({ movimientos }) => {
  const items = movimientos || [];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <History size={20} color="var(--cps-navy)" />
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Bitácora Contable Kardex en Vivo
        </h3>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
          No hay movimientos recientes registrados.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
          {items.map(m => {
            const esIngreso = m.tipo_movimiento === 'INGRESO';
            return (
              <div
                key={m.id_movimiento}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: esIngreso ? '#DCFCE7' : '#FEE2E2',
                    color: esIngreso ? '#16A34A' : '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {esIngreso ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}>
                      {m.insumo?.nombre || 'Insumo'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Lote: {m.lote?.numero_lote || 'N/A'} • {new Date(m.fecha_movimiento).toLocaleString('es-BO')}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: esIngreso ? '#16A34A' : '#DC2626'
                  }}>
                    {esIngreso ? `+${m.cantidad}` : `-${m.cantidad}`}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Bs. {parseFloat(m.costo_total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentKardexFeed;
