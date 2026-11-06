/**
 * @file App.js
 * @description Punto de entrada de la aplicación móvil de operarios de pasillo - Caja Petrolera de Salud.
 * Incorpora navegación entre Escáner de Pasillo, Detalle de Lote e Inteligencia Artificial (SIGMAT IA).
 */

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import LoteDetailScreen from './src/screens/LoteDetailScreen';
import AIPredictionsScreen from './src/screens/AIPredictionsScreen';

const MainNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'scanner' | 'lote_detail' | 'ai_predictions'
  const [selectedQr, setSelectedQr] = useState(null);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Navegación entre vistas del operario
  const handleOpenScanner = () => {
    setCurrentScreen('scanner');
  };

  const handleOpenAI = () => {
    setCurrentScreen('ai_predictions');
  };

  const handleScanSuccess = (qrCode) => {
    setSelectedQr(qrCode);
    setCurrentScreen('lote_detail');
  };

  const handleSelectLoteByQr = (qrCode) => {
    setSelectedQr(qrCode);
    setCurrentScreen('lote_detail');
  };

  const handleBackToHome = () => {
    setSelectedQr(null);
    setCurrentScreen('home');
  };

  const showBottomNav = currentScreen === 'home' || currentScreen === 'ai_predictions';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#004D44" />

      <View style={styles.screenContainer}>
        {currentScreen === 'home' && (
          <HomeScreen
            onOpenScanner={handleOpenScanner}
            onSelectLoteByQr={handleSelectLoteByQr}
            onNavigateToAI={handleOpenAI}
          />
        )}
        {currentScreen === 'scanner' && (
          <ScannerScreen
            onScanSuccess={handleScanSuccess}
            onCancel={handleBackToHome}
          />
        )}
        {currentScreen === 'lote_detail' && (
          <LoteDetailScreen
            codigoQr={selectedQr}
            onBack={handleBackToHome}
            onComplete={handleBackToHome}
          />
        )}
        {currentScreen === 'ai_predictions' && (
          <AIPredictionsScreen
            onBack={handleBackToHome}
            onSelectInsumoForDispatch={handleSelectLoteByQr}
          />
        )}
      </View>

      {/* Barra de Navegación Inferior Institucional */}
      {showBottomNav && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.bottomNavItem, currentScreen === 'home' && styles.bottomNavItemActive]}
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <Text style={[styles.bottomNavIcon, currentScreen === 'home' && styles.bottomNavIconActive]}>
              🏠
            </Text>
            <Text style={[styles.bottomNavLabel, currentScreen === 'home' && styles.bottomNavLabelActive]}>
              Operaciones
            </Text>
          </TouchableOpacity>

          {/* Botón flotante central de escáner */}
          <TouchableOpacity
            style={styles.floatingScanBtn}
            onPress={handleOpenScanner}
            activeOpacity={0.85}
          >
            <Text style={styles.floatingScanIcon}>📷</Text>
            <Text style={styles.floatingScanLabel}>QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomNavItem, currentScreen === 'ai_predictions' && styles.bottomNavItemActive]}
            onPress={handleOpenAI}
            activeOpacity={0.8}
          >
            <Text style={[styles.bottomNavIcon, currentScreen === 'ai_predictions' && styles.bottomNavIconActive]}>
              🧠
            </Text>
            <Text style={[styles.bottomNavLabel, currentScreen === 'ai_predictions' && styles.bottomNavLabelActive]}>
              SIGMAT IA
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#004D44'
  },
  screenContainer: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#004D44',
    borderTopWidth: 1,
    borderTopColor: '#006459',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 12
  },
  bottomNavItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  bottomNavIcon: {
    fontSize: 18,
    opacity: 0.7
  },
  bottomNavIconActive: {
    opacity: 1
  },
  bottomNavLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#80CBC4',
    marginTop: 2
  },
  bottomNavLabelActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  floatingScanBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#007B6D',
    borderWidth: 3,
    borderColor: '#80CBC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  floatingScanIcon: {
    fontSize: 18
  },
  floatingScanLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  }
});
