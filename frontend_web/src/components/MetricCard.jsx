/**
 * @file MetricCard.jsx
 * @description Tarjeta estadística gerencial con variantes para Alertas Críticas (Rojo), Preventivas (Amarillo) y Financieras.
 */

import React from 'react';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'default' | 'danger-red' | 'warning-amber' | 'success-green' | 'blue'
  badgeText
}) => {
  const getStylesByVariant = () => {
    switch (variant) {
      case 'danger-red':
        return {
          borderTop: '4px solid var(--alert-red)',
          iconBg: 'var(--alert-red-light)',
          iconColor: 'var(--alert-red)',
          glow: 'var(--shadow-alert)'
        };
      case 'warning-amber':
        return {
          borderTop: '4px solid var(--alert-amber)',
          iconBg: 'var(--alert-amber-light)',
          iconColor: 'var(--alert-amber)',
          glow: 'none'
        };
      case 'success-green':
        return {
          borderTop: '4px solid var(--status-green)',
          iconBg: 'var(--status-green-light)',
          iconColor: 'var(--status-green)',
          glow: 'none'
        };
      case 'blue':
        return {
          borderTop: '4px solid var(--cps-blue)',
          iconBg: 'var(--cps-blue-bg)',
          iconColor: 'var(--cps-blue)',
          glow: 'none'
        };
      default:
        return {
          borderTop: '4px solid var(--cps-navy)',
          iconBg: '#F1F5F9',
          iconColor: 'var(--cps-navy)',
          glow: 'none'
        };
    }
  };

  const styleConfig = getStylesByVariant();

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px 22px',
        borderTop: styleConfig.borderTop,
        boxShadow: styleConfig.glow !== 'none' ? styleConfig.glow : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            {value}
          </div>
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: styleConfig.iconBg,
          color: styleConfig.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
        {badgeText && (
          <span className={`badge ${variant === 'danger-red' ? 'badge-red' : variant === 'warning-amber' ? 'badge-amber' : 'badge-blue'}`}>
            {variant === 'danger-red' && <span className="pulse-dot-red" />}
            {variant === 'warning-amber' && <span className="pulse-dot-amber" />}
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
