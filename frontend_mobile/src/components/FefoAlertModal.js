/**
 * @file FefoAlertModal.js
 * @description Modal de alerta visual crítico cuando la API devuelve HTTP 403 por infracción FEFO/FIFO.
 * Guía visualmente al operario indicando el lote prioritario que debe retirar del pasillo.
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const FefoAlertModal = ({ visible, errorData, onClose, onScanMandatory }) => {
  if (!errorData) return null;

  const data = errorData.data || {};
  const rechazado = data.lote_rechazado || {};
  const obligatorio = data.lote_obligatorio || {};
  const insumo = data.insumo || {};
  const regla = data.regla_aplicada || 'FEFO (Sanitario)';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabecera de Alerta */}
          <View style={styles.header}>
            <Text style={styles.iconWarning}>⛔</Text>
            <Text style={styles.title}>¡DESPACHO BLOQUEADO!</Text>
            <Text style={styles.subtitle}>HTTP 403 FORBIDDEN - REGLA {regla.toUpperCase()}</Text>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 10 }}>
            <Text style={styles.description}>
              {errorData.message || 'El sistema ha impedido el despacho porque existe un lote con mayor prioridad de rotación.'}
            </Text>

            <View style={styles.insumoCard}>
              <Text style={styles.insumoTitle}>{insumo.codigo_institucional || ''} - {insumo.nombre || 'Insumo'}</Text>
              <Text style={styles.insumoType}>TIPO: {insumo.tipo || 'SANITARIO'}</Text>
            </View>

            {/* Comparativa Visual: Lote Rechazado vs Lote Obligatorio */}
            <View style={styles.comparisonContainer}>
              {/* Tarjeta Roja: Lote que intentó sacar */}
              <View style={[styles.card, styles.cardRejected]}>
                <View style={styles.tagRejected}>
                  <Text style={styles.tagText}>RECHAZADO</Text>
                </View>
                <Text style={styles.label}>Lote Escaneado:</Text>
                <Text style={styles.lotNumber}>{rechazado.numero_lote || 'N/A'}</Text>
                <Text style={styles.dateLabel}>Caduca:</Text>
                <Text style={styles.dateValue}>{rechazado.fecha_vencimiento || 'N/A'}</Text>
              </View>

              {/* Tarjeta Verde: Lote que DEBE sacar */}
              <View style={[styles.card, styles.cardMandatory]}>
                <View style={styles.tagMandatory}>
                  <Text style={styles.tagText}>OBLIGATORIO</Text>
                </View>
                <Text style={styles.label}>Lote a Retirar:</Text>
                <Text style={styles.lotNumberGold}>{obligatorio.numero_lote || 'N/A'}</Text>
                <Text style={styles.dateLabel}>Caduca más próximo:</Text>
                <Text style={styles.dateValueGreen}>{obligatorio.fecha_vencimiento || 'N/A'}</Text>
                <Text style={styles.stockLabel}>Stock: {obligatorio.cantidad_disponible} uds</Text>
              </View>
            </View>

            {/* Instrucción directa de ubicación en pasillo */}
            <View style={styles.locationBanner}>
              <Text style={styles.locationTitle}>📍 DIRÍJASE AL PASILLO:</Text>
              <Text style={styles.locationText}>{obligatorio.ubicacion_pasillo || 'Consultar mapa de estantería'}</Text>
            </View>
          </ScrollView>

          {/* Botón de acción */}
          <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>ENTENDIDO, BUSCARÉ EL LOTE OBLIGATORIO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#DC2626'
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingBottom: 12,
    marginBottom: 12
  },
  iconWarning: {
    fontSize: 44,
    marginBottom: 4
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#991B1B',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 2,
    letterSpacing: 0.5
  },
  body: {
    maxHeight: 360
  },
  description: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center'
  },
  insumoCard: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  insumoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827'
  },
  insumoType: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5
  },
  cardRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444'
  },
  cardMandatory: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A'
  },
  tagRejected: {
    backgroundColor: '#DC2626',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  tagMandatory: {
    backgroundColor: '#16A34A',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 11,
    color: '#6B7280'
  },
  lotNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991B1B',
    marginVertical: 2
  },
  lotNumberGold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginVertical: 2
  },
  dateLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626'
  },
  dateValueGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D'
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    marginTop: 4
  },
  locationBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E'
  },
  locationText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#78350F',
    marginTop: 2
  },
  actionButton: {
    backgroundColor: '#007B6D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5
  }
});

export default FefoAlertModal;
