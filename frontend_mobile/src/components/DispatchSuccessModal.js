/**
 * @file DispatchSuccessModal.js
 * @description Modal de confirmación de despacho exitoso con comprobante de Kardex y saldo actualizado.
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const DispatchSuccessModal = ({ visible, data, onClose }) => {
  if (!data) return null;

  const insumo = data.insumo || {};
  const lote = data.lote || {};
  const kardex = data.kardex || {};

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          <Text style={styles.title}>¡Despacho Confirmado!</Text>
          <Text style={styles.subtitle}>Kardex Inmutable Registrado (ID: #{kardex.id_movimiento || '-'})</Text>

          <View style={styles.detailsBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Insumo:</Text>
              <Text style={styles.value} numberOfLines={1}>{insumo.nombre}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lote:</Text>
              <Text style={styles.value}>{lote.numero_lote}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cant. Despachada:</Text>
              <Text style={styles.valueHighlight}>{lote.cantidad_despachada} unidades</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Saldo Restante Lote:</Text>
              <Text style={styles.value}>{lote.saldo_restante_lote} unidades</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Estado del Lote:</Text>
              <Text style={[styles.value, { color: lote.estado_lote === 'AGOTADO' ? '#DC2626' : '#16A34A' }]}>
                {lote.estado_lote}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>ESCANEAR SIGUIENTE INSUMO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    elevation: 5
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  checkIcon: {
    fontSize: 32,
    color: '#16A34A',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    width: '100%',
    padding: 12,
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  label: {
    fontSize: 13,
    color: '#4B5563'
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    maxWidth: '60%',
    textAlign: 'right'
  },
  valueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007B6D'
  },
  button: {
    backgroundColor: '#007B6D',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5
  }
});

export default DispatchSuccessModal;
