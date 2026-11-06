/**
 * @file App.jsx
 * @description Aplicación Principal - Sistema Integral de Almacenes
 * Caja Petrolera de Salud (CPS) - Regional Cochabamba
 * Color institucional: #007B6D (Verde CPS) | #FFFFFF (Blanco)
 */

import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#F0F4F3] text-[#1A2332] font-sans antialiased">
      <DashboardLayout />
    </div>
  );
}

export default App;
