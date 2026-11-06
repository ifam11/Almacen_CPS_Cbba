/**
 * @file LoteDetailScreen.js
 * @description Pantalla de detalle del lote escaneado, selector de cantidad y confirmación de despacho con control FEFO/FIFO.
 * Rediseñado con Verde Institucional CPS (#007B6D) y Blanco (#FFFFFF).
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import api from '../config/api';
import FefoAlertModal from '../components/FefoAlertModal';
import DispatchSuccessModal from '../components/DispatchSuccessModal';

const LoteDetailScreen = ({ codigoQr, onBack, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [lote, setLote] = useState(null);
  const [error, setError] = useState(null);

  // Campos de despacho
  const [cantidad, setCantidad] = useState('1');
  const [departamento, setDepartamento] = useState('Emergencias');
  const [observaciones, setObservaciones] = useState('');
  const [despachando, setDespachando] = useState(false);

  // Estados de Modales
  const [fefoErrorModal, setFefoErrorModal] = useState(false);
  const [fefoErrorData, setFefoErrorData] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Cargar datos del lote mediante petición GET por código QR
  useEffect(() => {
    fetchLoteData();
  }, [codigoQr]);

  const fetchLoteData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (codigoQr.includes('DEMO')) {
        setLote({
          id_lote: 99,
          numero_lote: codigoQr.includes('VALID') ? 'LOT-2026-A1' : 'LOT-2026-B9',
          codigo_qr: codigoQr,
          cantidad_actual: 120,
          fecha_vencimiento: codigoQr.includes('VALID') ? '2026-11-15' : '2027-08-30',
          ubicacion_pasillo: 'Pasillo 2, Estante B, Nivel 1',
          insumo: {
            id_insumo: 1,
            codigo_institucional: 'MED-AMOX-500',
            nombre: 'Amoxicilina 500mg',
            tipo: 'SANITARIO',
            unidad_medida: 'Caja x 100'
          },
          proveedor: { razon_social: 'Droguería INTI S.A.' }
        });
        setLoading(false);
        return;
      }

      const res = await api.get(`/recepcion/qr/${encodeURIComponent(codigoQr)}`);
      if (res.data && res.data.success) {
        setLote(res.data.data);
      } else {
        throw new Error(res.data.message || 'Lote no localizado');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al consultar lote';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCantidad = (delta) => {
    const actual = parseInt(cantidad, 10) || 0;
    const nueva = actual + delta;
    if (nueva >= 1 && nueva <= (lote?.cantidad_actual || 1)) {
      setCantidad(String(nueva));
    }
  };

  const handleMaxCantidad = () => {
    if (lote) {
      setCantidad(String(lote.cantidad_actual));
    }
  };

  const handleConfirmarDespacho = async () => {
    const cantNum = parseInt(cantidad, 10);
    if (isNaN(cantNum) || cantNum <= 0) {
      Alert.alert('Error', 'La cantidad debe ser mayor a 0');
      return;
    }

    if (cantNum > lote.cantidad_actual) {
      Alert.alert('Stock Insuficiente', `El lote solo dispone de ${lote.cantidad_actual} unidades.`);
      return;
    }

    setDespachando(true);
    try {
      if (codigoQr === 'CPS-LOT-1-DEMO-INVALID-FEFO') {
        const errorSimulado = {
          message: 'BLOQUEO POR REGLA FEFO SANITARIA: No se puede despachar el lote más nuevo.',
          data: {
            codigo_bloqueo: 'FEFO_VIOLATION_HTTP_403',
            regla_aplicada: 'FEFO (Sanitario)',
            insumo: lote.insumo,
            lote_rechazado: {
              numero_lote: lote.numero_lote,
              fecha_vencimiento: lote.fecha_vencimiento
            },
            lote_obligatorio: {
              numero_lote: 'LOT-2026-A1',
              fecha_vencimiento: '2026-11-15',
              cantidad_disponible: 45,
              ubicacion_pasillo: 'Pasillo 2, Estante A, Nivel 1'
            }
          }
        };
        setFefoErrorData(errorSimulado);
        setFefoErrorModal(true);
        setDespachando(false);
        return;
      }

      const res = await api.post('/despacho', {
        codigo_qr: lote.codigo_qr,
        cantidad: cantNum,
        departamento_destino: departamento.trim(),
        observaciones: observaciones.trim()
      });

      if (res.data && res.data.success) {
        setSuccessData(res.data.data);
        setSuccessModal(true);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setFefoErrorData(err.response.data);
        setFefoErrorModal(true);
      } else {
        const msg = err.response?.data?.message || err.message || 'Error al procesar despacho';
        Alert.alert('Fallo en Despacho', msg);
      }
    } finally {
      setDespachando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#004D44" />
        <ActivityIndicator size="large" color="#007B6D" />
        <Text style={styles.loadingText}>Consultando datos del lote en inventario CPS...</Text>
      </View>
    );
  }

  if (error || !lote) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#004D44" />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Lote No Encontrado</Text>
        <Text style={styles.errorMsg}>{error || 'El código QR no pertenece a ningún lote registrado.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>VOLVER A ESCANEAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const esSanitario = lote.insumo?.tipo === 'SANITARIO';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004D44" />

      {/* 1. Barra Superior Institucional */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.headerBackText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSub}>CPS HOSPITAL OBRERO N° 2</Text>
          <Text style={styles.headerTitle}>DESPACHO DE LOTE</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. Etiqueta de Tipo de Insumo y Regla FEFO/FIFO */}
        <View style={[styles.ruleBadge, esSanitario ? styles.badgeFefo : styles.badgeFifo]}>
          <Text style={styles.ruleBadgeIcon}>{esSanitario ? '🛡️' : '📦'}</Text>
          <Text style={[styles.ruleBadgeText, esSanitario ? styles.ruleTextFefo : styles.ruleTextFifo]}>
            {esSanitario ? 'INSUMO SANITARIO: ROTACIÓN FEFO OBLIGATORIA' : 'INSUMO ADMINISTRATIVO: ROTACIÓN FIFO'}
          </Text>
        </View>

        {/* 3. Tarjeta del Insumo */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.itemCode}>{lote.insumo?.codigo_institucional}</Text>
            <Text style={styles.insumoTypeBadge}>{lote.insumo?.tipo || 'FÁRMACO'}</Text>
          </View>
          <Text style={styles.itemName}>{lote.insumo?.nombre}</Text>
          <Text style={styles.itemUnit}>Presentación: {lote.insumo?.unidad_medida}</Text>

          <View style={styles.separator} />

          {/* Datos del Lote Físico */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>N° DE LOTE:</Text>
              <Text style={styles.metaValue}>{lote.numero_lote}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>FECHA VENCIMIENTO:</Text>
              <Text style={[styles.metaValue, { color: esSanitario ? '#EF4444' : '#111827', fontWeight: '900' }]}>
                {lote.fecha_vencimiento}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>STOCK DISPONIBLE:</Text>
              <Text style={styles.stockHighlight}>{lote.cantidad_actual} unidades</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>UBICACIÓN PASILLO:</Text>
              <Text style={styles.locationValue}>📍 {lote.ubicacion_pasillo || 'Sin asignar'}</Text>
            </View>
          </View>
        </View>

        {/* 4. Formulario de Despacho */}
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>DATOS DEL DESPACHO DE PASILLO</Text>

          {/* Selector de Cantidad */}
          <Text style={styles.inputLabel}>Cantidad a retirar:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAdjustCantidad(-1)} activeOpacity={0.7}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.qtyInput}
              keyboardType="number-pad"
              value={cantidad}
              onChangeText={setCantidad}
            />

            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAdjustCantidad(1)} activeOpacity={0.7}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.maxBtn} onPress={handleMaxCantidad} activeOpacity={0.8}>
              <Text style={styles.maxBtnText}>MÁX ({lote.cantidad_actual})</Text>
            </TouchableOpacity>
          </View>

          {/* Servicio de destino */}
          <Text style={styles.inputLabel}>Servicio / Sala Médica de Destino:</Text>
          <TextInput
            style={styles.textInput}
            value={departamento}
            onChangeText={setDepartamento}
            placeholder="Ej: Quirófano 1, Emergencias, UCI"
            placeholderTextColor="#94A3B8"
          />

          {/* Observaciones */}
          <Text style={styles.inputLabel}>Observaciones (Opcional):</Text>
          <TextInput
            style={styles.textInput}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Notas del operario..."
            placeholderTextColor="#94A3B8"
          />

          {/* Botón de Confirmación Institucional */}
          <TouchableOpacity
            style={[styles.dispatchButton, despachando && styles.dispatchButtonDisabled]}
            onPress={handleConfirmarDespacho}
            disabled={despachando}
            activeOpacity={0.85}
          >
            {despachando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.dispatchButtonText}>VALIDAR Y CONFIRMAR DESPACHO</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Bloqueo FEFO / FIFO (HTTP 403) */}
      <FefoAlertModal
        visible={fefoErrorModal}
        errorData={fefoErrorData}
        onClose={() => setFefoErrorModal(false)}
      />

      {/* Modal de Éxito con Kardex Inmutable */}
      <DispatchSuccessModal
        visible={successModal}
        data={successData}
        onClose={() => {
          setSuccessModal(false);
          onComplete();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F3'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F3'
  },
  loadingText: {
    color: '#004D44',
    marginTop: 14,
    fontSize: 13,
    fontWeight: '700'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F0F4F3'
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  errorMsg: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20
  },
  backButton: {
    backgroundColor: '#007B6D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: '#004D44',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#006459',
    elevation: 4
  },
  headerBackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  headerBackText: {
    color: '#80CBC4',
    fontSize: 12,
    fontWeight: '700'
  },
  headerTitleBox: {
    alignItems: 'center'
  },
  headerSub: {
    color: '#80CBC4',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  content: {
    padding: 16
  },
  ruleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 14
  },
  badgeFefo: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  badgeFifo: {
    backgroundColor: '#E0F2F1',
    borderWidth: 1,
    borderColor: '#80CBC4'
  },
  ruleBadgeIcon: {
    fontSize: 14
  },
  ruleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    flex: 1
  },
  ruleTextFefo: {
    color: '#991B1B'
  },
  ruleTextFifo: {
    color: '#004D44'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#007B6D',
    letterSpacing: 0.5
  },
  insumoTypeBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#004D44',
    backgroundColor: '#E0F2F1',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  itemName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4
  },
  itemUnit: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  gridCol: {
    flex: 1
  },
  metaLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
    letterSpacing: 0.5
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2
  },
  stockHighlight: {
    fontSize: 16,
    fontWeight: '900',
    color: '#007B6D',
    marginTop: 2
  },
  locationValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004D44',
    marginTop: 2
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#004D44',
    marginBottom: 14,
    letterSpacing: 0.8
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  qtyBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#80CBC4'
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004D44'
  },
  qtyInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAF9',
    borderWidth: 1.5,
    borderColor: '#80CBC4',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: '#004D44'
  },
  maxBtn: {
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#007B6D',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  maxBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11
  },
  textInput: {
    backgroundColor: '#F8FAF9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 14
  },
  dispatchButton: {
    backgroundColor: '#007B6D',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  dispatchButtonDisabled: {
    backgroundColor: '#94A3B8'
  },
  dispatchButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.8
  }
});

export default LoteDetailScreen;
