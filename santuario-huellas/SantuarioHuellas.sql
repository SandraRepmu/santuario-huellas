-- Creo la base de datos en caso de no existir
CREATE DATABASE IF NOT EXISTS santuario_huellas;
USE santuario_huellas;

-- Tabla de animales
CREATE TABLE IF NOT EXISTS animales (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  historia TEXT,
  especie VARCHAR(80),
  edad INT,
  esterilizado TINYINT(1) DEFAULT 0,
  microchip VARCHAR(80),
  sexo VARCHAR(11) DEFAULT 'Desconocido',
  tamano VARCHAR(10) DEFAULT 'Mediano',
  vacunas TINYINT(1) DEFAULT 0,
  raza VARCHAR(120),
  foto LONGTEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_adopcion TIMESTAMP NULL
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_apellidos VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL,
  telefono VARCHAR(40),
  UNIQUE KEY uq_clientes_email (email)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  motivo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  id_animal INT UNSIGNED,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_m_animal FOREIGN KEY (id_animal) REFERENCES animales(id) ON DELETE SET NULL
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(80) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL
);

-- Agrego un administrador admin
INSERT INTO administradores VALUES(1, 'admin', 'admin');

-- Tabla de la relación entre las tablas cliente y mensaje
CREATE TABLE IF NOT EXISTS cliente_mensaje (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT UNSIGNED NOT NULL,
  id_mensaje INT UNSIGNED NOT NULL,
  contestado TINYINT(1) DEFAULT 0,
  id_admin INT UNSIGNED,
  CONSTRAINT fk_cm_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_mensaje FOREIGN KEY (id_mensaje) REFERENCES mensajes(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_admin FOREIGN KEY (id_admin) REFERENCES administradores(id) ON DELETE SET NULL
);