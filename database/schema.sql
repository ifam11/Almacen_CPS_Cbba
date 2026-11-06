-- ============================================================================
-- BASE DE DATOS: ALMACEN CENTRAL - CAJA PETROLERA DE SALUD (CPS)
-- Motor: MySQL 8.0+ (Soporte ACID, Transaccional InnoDB, UTF8MB4)
-- Cumplimiento: Trazabilidad inmutable, Lógica por Lotes, Reglas FEFO y FIFO
-- ============================================================================

CREATE DATABASE IF NOT EXISTS almacen_cps
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE almacen_cps;

-- Desactivar temporalmente revisión de FK para creación limpia
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- TABLA 1: ROLES (RBAC: Administrador, Gerente, Encargado, Operario, Solicitante)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS bitacora_auditoria;
DROP TABLE IF EXISTS movimiento_kardex;
DROP TABLE IF EXISTS detalle_solicitud;
DROP TABLE IF EXISTS solicitudes_despacho;
DROP TABLE IF EXISTS lotes;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 2: USUARIOS
-- ----------------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) 
        REFERENCES roles (id_rol) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_rol (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 3: BITÁCORA DE AUDITORÍA (Trazabilidad estricta e inmutable)
-- ----------------------------------------------------------------------------
CREATE TABLE bitacora_auditoria (
    id_auditoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    accion VARCHAR(50) NOT NULL COMMENT 'POST, PUT, DELETE, LOGIN, DESPACHO_FEFO, etc.',
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id VARCHAR(100) NULL COMMENT 'ID del registro modificado',
    valores_anteriores JSON NULL COMMENT 'Snapshot previo para auditoría forense',
    valores_nuevos JSON NULL COMMENT 'Snapshot resultante',
    ip VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuarios FOREIGN KEY (id_usuario) 
        REFERENCES usuarios (id_usuario) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL,
    INDEX idx_auditoria_usuario (id_usuario),
    INDEX idx_auditoria_tabla (tabla_afectada),
    INDEX idx_auditoria_fecha (fecha_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 4: PROVEEDORES
-- ----------------------------------------------------------------------------
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nit_rut VARCHAR(40) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    contacto_nombre VARCHAR(100) NULL,
    telefono VARCHAR(30) NULL,
    email VARCHAR(100) NULL,
    direccion VARCHAR(255) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_proveedores_nit (nit_rut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 5: INSUMOS (Catálogo base: Sanitarios vs Administrativos)
-- ----------------------------------------------------------------------------
CREATE TABLE insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    codigo_institucional VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único CPS',
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    tipo ENUM('SANITARIO', 'ADMINISTRATIVO') NOT NULL COMMENT 'SANITARIO activa FEFO, ADMINISTRATIVO activa FIFO',
    unidad_medida VARCHAR(30) NOT NULL COMMENT 'Frasco, Ampolla, Caja, Paquete, Unidad, etc.',
    stock_minimo INT NOT NULL DEFAULT 10,
    punto_reorden INT NOT NULL DEFAULT 25,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_insumos_codigo (codigo_institucional),
    INDEX idx_insumos_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 6: LOTES (EL NÚCLEO DEL INVENTARIO - NO GLOBAL)
-- Cada lote posee su propia fecha de ingreso, caducidad, QR único y saldo.
-- ----------------------------------------------------------------------------
CREATE TABLE lotes (
    id_lote INT AUTO_INCREMENT PRIMARY KEY,
    id_insumo INT NOT NULL,
    id_proveedor INT NOT NULL,
    numero_lote VARCHAR(100) NOT NULL COMMENT 'Número asignado por fabricante/laboratorio',
    codigo_qr VARCHAR(255) NOT NULL UNIQUE COMMENT 'Hash/UUID codificado en el QR físico',
    cantidad_inicial INT NOT NULL,
    cantidad_actual INT NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('DISPONIBLE', 'AGOTADO', 'VENCIDO', 'CUARENTENA') NOT NULL DEFAULT 'DISPONIBLE',
    ubicacion_pasillo VARCHAR(50) NULL COMMENT 'Ej: Pasillo 3, Estante B, Nivel 2',
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lotes_insumo FOREIGN KEY (id_insumo) 
        REFERENCES insumos (id_insumo) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT fk_lotes_proveedor FOREIGN KEY (id_proveedor) 
        REFERENCES proveedores (id_proveedor) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT chk_lote_cantidad_positiva CHECK (cantidad_actual >= 0),
    CONSTRAINT chk_lote_costo_positivo CHECK (costo_unitario >= 0),
    -- Índice ultra-rápido para escaneo móvil por QR
    INDEX idx_lotes_qr (codigo_qr),
    -- Índice optimizado para consulta FEFO (Caducidad más próxima con stock disponible)
    INDEX idx_lotes_fefo (id_insumo, estado, fecha_vencimiento, cantidad_actual),
    -- Índice optimizado para consulta FIFO (Ingreso más antiguo con stock disponible)
    INDEX idx_lotes_fifo (id_insumo, estado, fecha_ingreso, cantidad_actual)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 7: SOLICITUDES DE DESPACHO
-- ----------------------------------------------------------------------------
CREATE TABLE solicitudes_despacho (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(50) NOT NULL UNIQUE,
    id_usuario_solicitante INT NOT NULL,
    departamento_destino VARCHAR(100) NOT NULL COMMENT 'Ej: Emergencias, Quirófano 1, Pediatría, RRHH',
    estado ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    motivo VARCHAR(255) NULL,
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitudes_usuario FOREIGN KEY (id_usuario_solicitante) 
        REFERENCES usuarios (id_usuario) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    INDEX idx_solicitudes_estado (estado),
    INDEX idx_solicitudes_fecha (fecha_solicitud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 8: DETALLE DE SOLICITUD
-- ----------------------------------------------------------------------------
CREATE TABLE detalle_solicitud (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT NOT NULL,
    id_insumo INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    cantidad_despachada INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_detallesol_solicitud FOREIGN KEY (id_solicitud) 
        REFERENCES solicitudes_despacho (id_solicitud) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    CONSTRAINT fk_detallesol_insumo FOREIGN KEY (id_insumo) 
        REFERENCES insumos (id_insumo) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT chk_detalle_cantidades CHECK (cantidad_solicitada > 0 AND cantidad_despachada >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- TABLA 9: MOVIMIENTO KARDEX (Inmutable, Histórico de Entradas y Salidas)
-- Base fundamental para auditoría contable y predicción con Machine Learning
-- ----------------------------------------------------------------------------
CREATE TABLE movimiento_kardex (
    id_movimiento BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_insumo INT NOT NULL,
    id_lote INT NOT NULL,
    id_usuario INT NOT NULL,
    id_solicitud INT NULL,
    tipo_movimiento ENUM('INGRESO', 'DESPACHO', 'AJUSTE', 'BAJA_VENCIMIENTO') NOT NULL,
    cantidad INT NOT NULL COMMENT 'Cantidad operada en el movimiento',
    saldo_lote_resultante INT NOT NULL COMMENT 'Stock remanente del lote específico tras la operación',
    costo_unitario DECIMAL(10,2) NOT NULL,
    costo_total DECIMAL(10,2) NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones VARCHAR(255) NULL,
    deleted_at DATETIME NULL COMMENT 'Preservación de borrado lógico inmutable',
    CONSTRAINT fk_kardex_insumo FOREIGN KEY (id_insumo) 
        REFERENCES insumos (id_insumo) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT fk_kardex_lote FOREIGN KEY (id_lote) 
        REFERENCES lotes (id_lote) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT fk_kardex_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios (id_usuario) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    CONSTRAINT fk_kardex_solicitud FOREIGN KEY (id_solicitud) 
        REFERENCES solicitudes_despacho (id_solicitud) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL,
    -- Índice clave para el entrenamiento del modelo Random Forest / ARIMA
    INDEX idx_kardex_ml (id_insumo, fecha_movimiento, tipo_movimiento),
    INDEX idx_kardex_lote (id_lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
