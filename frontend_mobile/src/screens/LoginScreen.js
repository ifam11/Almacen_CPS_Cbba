/**
 * @file LoginScreen.js
 * @description Pantalla de inicio de sesión institucional para operarios de almacén CPS.
 * Diseño móvil premium con Verde Institucional (#007B6D) y Blanco (#FFFFFF).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('operario@cps.gob.bo');
  const [password, setPassword] = useState('Admin123*');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#004D44" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Encabezado Institucional */}
        <View style={styles.header}>
          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoCross}>✚</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.title}>CAJA PETROLERA DE SALUD</Text>
          <Text style={styles.regionalText}>REGIONAL COCHABAMBA</Text>
          <Text style={styles.subtitle}>Gestión de Inventarios y Despacho Móvil</Text>
          <View style={styles.badgeRol}>
            <Text style={styles.badgeRolText}>MÓDULO DE PASILLO (OPERARIOS)</Text>
          </View>
        </View>

        {/* Tarjeta del Formulario */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@cps.gob.bo"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>INGRESAR AL SISTEMA</Text>
            )}
          </TouchableOpacity>

          <View style={styles.credentialsHint}>
            <Text style={styles.hintTitle}>Credenciales de prueba preconfiguradas:</Text>
            <View style={styles.hintRow}>
              <Text style={styles.hintKey}>Usuario:</Text>
              <Text style={styles.hintValue}>operario@cps.gob.bo</Text>
            </View>
            <View style={styles.hintRow}>
              <Text style={styles.hintKey}>Contraseña:</Text>
              <Text style={styles.hintValue}>Admin123*</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          Hospital Obrero N° 2 • Cochabamba, Bolivia
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004D44'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoBadgeContainer: {
    position: 'relative',
    marginBottom: 14
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#80CBC4'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4DB6AC',
    borderWidth: 2,
    borderColor: '#004D44'
  },
  logoCross: {
    fontSize: 34,
    color: '#007B6D',
    fontWeight: '900'
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textAlign: 'center'
  },
  regionalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#80CBC4',
    letterSpacing: 1.5,
    marginTop: 2
  },
  subtitle: {
    fontSize: 13,
    color: '#E0F2F1',
    marginTop: 6,
    textAlign: 'center'
  },
  badgeRol: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  badgeRolText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#004D44',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#F8FAF9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A2332',
    marginBottom: 16
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#007B6D',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007B6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  credentialsHint: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  hintTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textAlign: 'center'
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  hintKey: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  hintValue: {
    fontSize: 11,
    color: '#007B6D',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  footerText: {
    textAlign: 'center',
    color: '#80CBC4',
    fontSize: 11,
    marginTop: 20,
    fontWeight: '600'
  }
});

export default LoginScreen;
