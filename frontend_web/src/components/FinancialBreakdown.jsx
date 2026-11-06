/**
 * @file FinancialBreakdown.jsx
 * @description Tarjeta de desglose de valorización monetaria y rotación de insumos sanitarios vs administrativos.
 */

import React from 'react';
import { DollarSign, Activity, PieChart, Layers } from 'lucide-react';

const FinancialBreakdown = ({ financiero, indicadores }) => {
  const total = financiero?.valor_total_almacen || 0;
  const sanitarios = financiero?.valor_sanitarios || 0;
  const administrativos = financiero?.valor_administrativos || 0;

  const pctSanitarios = total > 0 ? ((sanitarios / total) * 100).toFixed(1) : 0;
  const pctAdministrativos = total > 0 ? ((administrativos / total) * 100).toFixed(1) : 0;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PieChart size={20} color="var(--cps-navy)" />
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Composición del Capital y Rotación
        </h3>
      </div>

      {/* Barras de distribución porcentual */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
          <span>Insumos Sanitarios ({pctSanitarios}%)</span>
          <span>Administrativos ({pctAdministrativos}%)</span>
        </div>
        <div style={{ height: '10px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${pctSanitarios}%`, backgroundColor: '#0284C7', height: '100%' }} />
          <div style={{ width: `${pctAdministrativos}%`, backgroundColor: '#64748B', height: '100%' }} />
        </div>
      </div>

      {/* Detalle en Cifras */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #0284C7' }}>
          <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 'bold' }}>FÁRMACOS Y SANITARIOS</div>
          <div style={{ fontSize: '17px', fontWeight: '900', color: '#0C4A6E', marginTop: '2px' }}>
            Bs. {sanitarios.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '10px', color: '#0284C7', marginTop: '2px' }}>Sujeto a FEFO Estricto</div>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #64748B' }}>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold' }}>MATERIAL ADMINISTRATIVO</div>
          <div style={{ fontSize: '17px', fontWeight: '900', color: '#1E293B', marginTop: '2px' }}>
            Bs. {administrativos.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Sujeto a FIFO</div>
        </div>
      </div>

      {/* Indicadores de Rotación */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Despachos últimos 30 días:</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
            Bs. {(indicadores?.costo_despachos_30_dias || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tasa de Rotación Mensual:</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--status-green)' }}>
            {indicadores?.tasa_rotacion_mensual || 0}x veces / mes
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Días de Cobertura Estimada:</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--cps-navy)' }}>
            ~ {indicadores?.dias_inventario_promedio || 0} días
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdown;
