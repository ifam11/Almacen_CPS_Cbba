/**
 * @file HomeScreen.js
 * @description Pantalla principal del operario de pasillo con el BOTÓN GIGANTE DE ESCÁNER de códigos QR.
 * Rediseñado con la identidad institucional de la Caja Petrolera de Salud:
 * Verde Institucional (#007B6D), Blanco (#FFFFFF) y acentos médicos.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ onOpenScanner, onSelectLoteByQr, onNavigateToAI }) => {
  const { user, logout } = useAuth();
  const [manualQr, setManualQr] = useState('');

  const handleManualSearch = () => {
    if (!manualQr.trim()) {
      Alert.alert('Atención', 'Ingrese un código QR o identificador de lote');
      return;
    }
    onSelectLoteByQr(manualQr.trim());
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004D44" />

      {/* 1. Barra Superior Institucional */}
      <View style={styles.topBar}>
        <View style={styles.operatorInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>✚</Text>
          </View>
          <View>
            <Text style={styles.headerHospital}>CAJA PETROLERA DE SALUD</Text>
            <Text style={styles.operatorName}>{user?.nombre_completo || 'Operario de Almacén'}</Text>
            <View style={styles.roleBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.operatorRole}>ROL: {user?.rol?.toUpperCase() || 'OPERARIO'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>SALIR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 2. Banner de Reglas de Negocio en Pasillo (FEFO/FIFO) */}
        <View style={styles.rulesBanner}>
          <View style={styles.rulesHeader}>
            <Text style={styles.rulesIcon}>🛡️</Text>
            <Text style={styles.rulesTitle}>PROTOCOLO DE DESPACHO EN PASILLO</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>
              <Text style={styles.boldGreen}>Insumos Sanitarios:</Text> FEFO estricto (Retirar lote con vencimiento más próximo).
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>
              <Text style={styles.boldGreen}>Insumos Administrativos:</Text> FIFO (Retirar lote más antiguo).
            </Text>
          </View>
          <View style={styles.ruleAlertBadge}>
            <Text style={styles.ruleAlertText}>
              ⛔ Bloqueo automático HTTP 403 ante cualquier intento de infracción.
            </Text>
          </View>
        </View>

        {/* MÓDULO INTELIGENCIA ARTIFICIAL & PREDICCIÓN DE DEMANDA */}
        <TouchableOpacity
          style={styles.aiCardShortcut}
          onPress={onNavigateToAI}
          activeOpacity={0.85}
        >
          <View style={styles.aiCardShortcutInner}>
            <View style={styles.aiCardIconCircle}>
              <Text style={styles.aiCardEmoji}>🧠</Text>
            </View>
            <View style={styles.aiCardTextCol}>
              <View style={styles.aiPillBadge}>
                <Text style={styles.aiPillText}>SCIKIT-LEARN IA</Text>
                <Text style={styles.aiPillMargin}>+15% ROP</Text>
              </View>
              <Text style={styles.aiCardTitle}>Predicción de Demanda &amp; ROP</Text>
              <Text style={styles.aiCardSubtitle}>
                Alertas de quiebre crítico y pronóstico mensual Random Forest
              </Text>
            </View>
            <Text style={styles.aiCardArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* 3. BOTÓN GIGANTE DE ESCÁNER REQUERIDO POR EL CORE */}
        <View style={styles.scannerSection}>
          <View style={styles.pulseRingOuter}>
            <View style={styles.pulseRingMid}>
              <TouchableOpacity
                style={styles.giantScannerButton}
                onPress={onOpenScanner}
                activeOpacity={0.85}
              >
                <View style={styles.scannerInnerCircle}>
                  <Text style={styles.qrIcon}>📷</Text>
                  <Text style={styles.scannerMainText}>ESCANEAR QR</Text>
                  <Text style={styles.scannerSubText}>CÁMARA DE PASILLO</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.scannerHint}>
            Presione para activar la cámara y apuntar a la etiqueta QR del lote físico
          </Text>
        </View>

        {/* 4. Respaldo: Búsqueda Manual de Código QR */}
        <View style={styles.manualCard}>
          <View style={styles.manualCardHeader}>
            <Text style={styles.manualIcon}>⌨️</Text>
            <Text style={styles.manualTitle}>¿Etiqueta dañada o cámara no disponible?</Text>
          </View>
          <Text style={styles.manualSubtitle}>
            Ingrese manualmente el código alfanumérico impreso en la etiqueta
          </Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="Ej: CPS-LOT-1-DEMO-..."
              placeholderTextColor="#94A3B8"
              value={manualQr}
              onChangeText={setManualQr}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.manualButton}
              onPress={handleManualSearch}
              activeOpacity={0.8}
            >
              <Text style={styles.manualButtonText}>BUSCAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Pie informativo de pasillo */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerHospital}>Hospital Obrero N° 2 • Regional Cochabamba</Text>
          <Text style={styles.footerVersion}>Sistema Almacén CPS Móvil • v2.4 ACID</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F3'
  },
  topBar: {
    backgroundColor: '#004D44',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#006459',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  operatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#80CBC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  avatarText: {
    fontSize: 20,
    color: '#007B6D',
    fontWeight: '900'
  },
  headerHospital: {
    color: '#80CBC4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  operatorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 1
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4DB6AC'
  },
  operatorRole: {
    color: '#E0F2F1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  logoutText: {
    color: '#FCA5A5',
    fontWeight: 'bold',
    fontSize: 11
  },
  content: {
    padding: 18,
    alignItems: 'center'
  },
  rulesBanner: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#007B6D',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  rulesIcon: {
    fontSize: 14
  },
  rulesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#004D44',
    letterSpacing: 0.5
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4
  },
  ruleBullet: {
    color: '#007B6D',
    fontSize: 12,
    fontWeight: 'bold'
  },
  ruleText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    flex: 1
  },
  boldGreen: {
    fontWeight: 'bold',
    color: '#004D44'
  },
  ruleAlertBadge: {
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  ruleAlertText: {
    fontSize: 10,
    color: '#991B1B',
    fontWeight: '700'
  },
  scannerSection: {
    alignItems: 'center',
    marginVertical: 10
  },
  pulseRingOuter: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 123, 109, 0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pulseRingMid: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(0, 123, 109, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  giantScannerButton: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#007B6D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16
  },
  scannerInnerCircle: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 3,
    borderColor: '#80CBC4',
    backgroundColor: '#004D44',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  qrIcon: {
    fontSize: 48,
    marginBottom: 6
  },
  scannerMainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  scannerSubText: {
    color: '#80CBC4',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5
  },
  scannerHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 16,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 16
  },
  manualCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  manualCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  manualIcon: {
    fontSize: 14
  },
  manualTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B'
  },
  manualSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  manualButton: {
    backgroundColor: '#007B6D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  manualButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5
  },
  footerInfo: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 10
  },
  footerHospital: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B'
  },
  footerVersion: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2
  },
  aiCardShortcut: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#80CBC4',
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },
  aiCardShortcutInner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  aiCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E6F4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  aiCardEmoji: {
    fontSize: 22
  },
  aiCardTextCol: {
    flex: 1
  },
  aiPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  aiPillText: {
    backgroundColor: '#007B6D',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  aiPillMargin: {
    backgroundColor: '#E6F4F1',
    color: '#007B6D',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  aiCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  aiCardSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  aiCardArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: '#007B6D',
    marginLeft: 8
  }
});

export default HomeScreen;
