/**
 * @file ScannerScreen.js
 * @description Pantalla de escaneo de cámara en tiempo real con visor de enfoque institucional CPS, linterna y decodificación QR.
 * Colores institucionales: Verde (#007B6D) y Blanco (#FFFFFF).
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.72;

const ScannerScreen = ({ onScanSuccess, onCancel }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    let parsedQr = data;
    try {
      const json = JSON.parse(data);
      if (json.qr) parsedQr = json.qr;
    } catch (e) {
      // String simple
    }

    onScanSuccess(parsedQr);
  };

  const handleSimulateScan = (tipo) => {
    setScanned(true);
    if (tipo === 'VIEJO_FEFO') {
      onScanSuccess('CPS-LOT-1-DEMO-VALID-FEFO');
    } else {
      onScanSuccess('CPS-LOT-1-DEMO-INVALID-FEFO');
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#004D44" />
        <Text style={styles.permissionText}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Vista de Cámara */}
      {permission.granted ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      ) : (
        <View style={styles.permissionDenied}>
          <Text style={styles.deniedIcon}>📷</Text>
          <Text style={styles.deniedText}>Permiso de cámara no concedido</Text>
          <Text style={styles.deniedSubtext}>
            Se requiere acceso a la cámara para escanear las etiquetas QR de los lotes farmacéuticos.
          </Text>
          <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
            <Text style={styles.grantButtonText}>CONCEDER PERMISO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Capa de Enfoque y Retícula */}
      <View style={styles.overlay}>
        {/* Cabecera superior con controles */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.roundButton} onPress={onCancel} activeOpacity={0.8}>
            <Text style={styles.roundButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.hospitalTag}>CPS COCHABAMBA</Text>
            <Text style={styles.scannerHeaderTitle}>ESCÁNER DE LOTE</Text>
          </View>

          <TouchableOpacity style={styles.roundButton} onPress={() => setTorch(!torch)} activeOpacity={0.8}>
            <Text style={styles.roundButtonText}>{torch ? '🔦' : '💡'}</Text>
          </TouchableOpacity>
        </View>

        {/* Retícula de Enfoque con esquinas institucionales */}
        <View style={styles.finderContainer}>
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.laserLine} />
          </View>
          <Text style={styles.instruction}>Enfoque el código QR de la etiqueta</Text>
        </View>

        {/* Barra de simulación rápida para desarrollo y demostración */}
        <View style={styles.simulationBar}>
          <Text style={styles.simTitle}>🧪 Simulador de Pruebas de Despacho:</Text>
          <View style={styles.simButtonsRow}>
            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: '#007B6D' }]}
              onPress={() => handleSimulateScan('VIEJO_FEFO')}
              activeOpacity={0.8}
            >
              <Text style={styles.simButtonText}>✓ Lote Válido (FEFO)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.simButton, { backgroundColor: '#EF4444' }]}
              onPress={() => handleSimulateScan('NUEVO_RECHAZO')}
              activeOpacity={0.8}
            >
              <Text style={styles.simButtonText}>⛔ Probar Infracción (403)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#004D44',
    justifyContent: 'center',
    alignItems: 'center'
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#004D44'
  },
  deniedIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  deniedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center'
  },
  deniedSubtext: {
    color: '#80CBC4',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18
  },
  grantButton: {
    backgroundColor: '#007B6D',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4
  },
  grantButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitleBox: {
    alignItems: 'center'
  },
  hospitalTag: {
    color: '#80CBC4',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 77, 68, 0.75)',
    borderWidth: 1,
    borderColor: '#80CBC4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roundButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  scannerHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  finderContainer: {
    alignItems: 'center'
  },
  reticle: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 109, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#80CBC4'
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 6 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 6 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 6 },
  laserLine: {
    width: '92%',
    height: 2,
    backgroundColor: '#007B6D',
    shadowColor: '#80CBC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 18,
    backgroundColor: 'rgba(0, 77, 68, 0.8)',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#80CBC4'
  },
  simulationBar: {
    backgroundColor: 'rgba(0, 50, 44, 0.9)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(128, 203, 196, 0.3)'
  },
  simTitle: {
    color: '#80CBC4',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  simButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center'
  },
  simButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  }
});

export default ScannerScreen;
