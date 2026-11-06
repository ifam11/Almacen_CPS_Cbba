/**
 * @file QrDetailModal.jsx
 * @description Modal para visualización y reimpresión de etiquetas térmicas con Código QR.
 */

import React, { useState, useEffect } from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import api from '../services/api';

const QrDetailModal = ({ lote, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [etiquetaData, setEtiquetaData] = useState(null);

  useEffect(() => {
    if (lote) {
      cargarEtiqueta();
    }
  }, [lote]);

  const cargarEtiqueta = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/recepcion/reimprimir/${lote.id_lote}`);
      if (res.success) {
        setEtiquetaData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!lote) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '460px',
        width: '90%',
        padding: '24px',
        backgroundColor: '#FFFFFF',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <QrCode size={22} color="var(--cps-navy)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>
            Etiqueta Térmica con Código QR
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Generando renderizado de QR institucional...
          </div>
        ) : (
          <div>
            {/* Visualización de la etiqueta física */}
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '18px',
              backgroundColor: '#FAFAFA',
              textAlign: 'center',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--cps-navy)', letterSpacing: '0.5px' }}>
                CAJA PETROLERA DE SALUD
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                ALMACÉN CENTRAL • REGISTRO SANITARIO
              </div>

              {etiquetaData?.etiqueta_impresion?.qr_base64 && (
                <img
                  src={etiquetaData.etiqueta_impresion.qr_base64}
                  alt="QR Lote"
                  style={{ width: '160px', height: '160px', margin: '0 auto', display: 'block' }}
                />
              )}

              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '8px' }}>
                {lote.insumo?.nombre}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--cps-blue)', fontWeight: '600' }}>
                CÓD: {lote.insumo?.codigo_institucional}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px solid #E5E7EB',
                fontSize: '11px',
                textAlign: 'left'
              }}>
                <div><strong>LOTE:</strong> {lote.numero_lote}</div>
                <div><strong>CADUCA:</strong> {lote.fecha_vencimiento}</div>
                <div><strong>UBICACIÓN:</strong> {lote.ubicacion_pasillo || 'Pasillo'}</div>
                <div><strong>CRITERIO:</strong> {lote.insumo?.tipo === 'SANITARIO' ? 'FEFO' : 'FIFO'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handlePrint}
              >
                <Printer size={16} /> Imprimir Etiqueta
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrDetailModal;
