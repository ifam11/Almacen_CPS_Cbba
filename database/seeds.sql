-- ============================================================================
-- SEED DATA: ALMACEN CENTRAL - CAJA PETROLERA DE SALUD (CPS)
-- Datos maestros iniciales de Roles, Proveedores e Insumos tipo Sanitario/Admin
-- ============================================================================

USE almacen_cps;

-- 1. ROLES REQUERIDOS POR RBAC
INSERT INTO roles (id_rol, nombre, descripcion) VALUES
(1, 'Administrador', 'Acceso total y configuración del ecosistema hospitalario'),
(2, 'Gerente', 'Visualización de dashboards, auditoría y reportes gerenciales'),
(3, 'Encargado', 'Gestión de catálogo, recepción de lotes y emisión de QR'),
(4, 'Operario', 'Uso móvil en pasillo: Escaneo de QR, picking y confirmación FEFO/FIFO'),
(5, 'Solicitante', 'Personal de salas y servicios médicos que solicita material')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), descripcion=VALUES(descripcion);

-- 2. USUARIO ADMINISTRADOR BASE (Contraseña por defecto: Admin123* -> bcrypt hash con costo 10)
-- $2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG
INSERT INTO usuarios (id_usuario, id_rol, nombre_completo, email, password_hash, activo) VALUES
(1, 1, 'Administrador Central CPS', 'admin@cps.gob.bo', '$2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG', 1),
(2, 2, 'Dra. María Elena Prado (Gerencia)', 'gerencia@cps.gob.bo', '$2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG', 1),
(3, 3, 'Lic. Carlos Mendoza (Encargado Almacén)', 'encargado@cps.gob.bo', '$2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG', 1),
(4, 4, 'Juan Pérez (Operario Pasillos)', 'operario@cps.gob.bo', '$2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG', 1),
(5, 5, 'Enf. Patricia Ruiz (Emergencias)', 'solicitante@cps.gob.bo', '$2a$10$rCzC92dK0pS.M9Gk/rPgeuvgGz9m2H9bY7xQ9vj2m6W8k7h6ZtNlG', 1)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. PROVEEDORES CLAVE
INSERT INTO proveedores (id_proveedor, nit_rut, razon_social, contacto_nombre, telefono, email, direccion) VALUES
(1, '1020304050', 'Droguería INTI S.A.', 'Lic. Roberto Vargas', '+591 2 2456789', 'ventas@drogueriainti.bo', 'Av. Busch #1234, La Paz'),
(2, '2030405060', 'Laboratorios Bagó de Bolivia', 'Dra. Sandra Quispe', '+591 2 2789123', 'pedidos@bago.com.bo', 'Calle 21 de Calacoto #45, La Paz'),
(3, '3040506070', 'Papelería y Suministros La Paz S.R.L.', 'Sr. Marco Morales', '+591 2 2334455', 'contacto@papelerialapaz.bo', 'Av. 6 de Agosto #890, La Paz')
ON DUPLICATE KEY UPDATE razon_social=VALUES(razon_social);

-- 4. INSUMOS DEMOSTRATIVOS (SANITARIOS PARA FEFO Y ADMINISTRATIVOS PARA FIFO)
INSERT INTO insumos (id_insumo, codigo_institucional, nombre, descripcion, tipo, unidad_medida, stock_minimo, punto_reorden) VALUES
(1, 'MED-AMOX-500', 'Amoxicilina 500mg', 'Antibiótico betalactámico en cápsulas', 'SANITARIO', 'Caja x 100', 30, 60),
(2, 'MED-PARAC-1G', 'Paracetamol 1g Inyectable', 'Solución para perfusión intravenosa', 'SANITARIO', 'Frasco', 50, 100),
(3, 'MAT-JERING-5ML', 'Jeringa Desechable 5ml c/ Aguja', 'Material sanitario estéril descartable', 'SANITARIO', 'Caja x 100', 40, 80),
(4, 'ADM-PAPEL-BOND', 'Papel Bond Carta 75g', 'Hojas resma para formularios médicos', 'ADMINISTRATIVO', 'Resma', 20, 50),
(5, 'ADM-TONER-HP', 'Tóner HP LaserJet 85A', 'Suministro para impresoras de recepción', 'ADMINISTRATIVO', 'Unidad', 5, 12)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
