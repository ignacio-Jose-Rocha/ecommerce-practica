SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `ecommerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `ecommerce` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `direccion` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `foto` VARCHAR(255) NULL DEFAULT NULL,
  `fecha_registro` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `rol` ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
  `estado_logueo` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ecommerce`.`metodos_pago` (
  `id_metodo_pago` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `nombre_titular` VARCHAR(100) NOT NULL,
  `numero_tarjeta` VARCHAR(255) NOT NULL,
  `fecha_expiracion` DATE NOT NULL,
  `cvv` VARCHAR(4) NOT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_metodo_pago`),
  INDEX `fk_metodos_pago_cliente_idx` (`id_cliente` ASC) VISIBLE,
  CONSTRAINT `fk_metodos_pago_cliente`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `ecommerce`.`clientes` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ecommerce`.`productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ecommerce`.`carrito` (
  `id_carrito` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NULL DEFAULT NULL,
  `id_producto` INT NULL DEFAULT NULL,
  `cantidad` INT NOT NULL,
  `fecha_agregado` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_carrito`),
  INDEX `id_cliente` (`id_cliente` ASC) VISIBLE,
  INDEX `id_producto` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `carrito_ibfk_1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `ecommerce`.`clientes` (`id_cliente`),
  CONSTRAINT `carrito_ibfk_2`
    FOREIGN KEY (`id_producto`)
    REFERENCES `ecommerce`.`productos` (`id_producto`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `ecommerce`.`pedidos` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NULL DEFAULT NULL,
  `fecha_pedido` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `total` DECIMAL(10,2) NULL DEFAULT NULL,
  `estado` ENUM('pendiente', 'procesado', 'enviado', 'entregado', 'cancelado') NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_pedido`),
  INDEX `idx_pedido_cliente` (`id_cliente` ASC) VISIBLE,
  CONSTRAINT `pedidos_ibfk_1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `ecommerce`.`clientes` (`id_cliente`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `ecommerce`.`clientes` (`nombre`, `apellido`, `direccion`, `email`, `contrasena`, `foto`) VALUES
('Laura', 'García', 'Calle Sol 123', 'laura.garcia@example.com', 'contraseñaSegura', 'foto1.jpg'),
('Carlos', 'Martínez', 'Avenida Luna 456', 'carlos.martinez@example.com', 'otraContraseña', 'foto2.jpg');

INSERT INTO `ecommerce`.`productos` (`nombre`, `descripcion`, `precio`, `stock`) VALUES
('Smartphone', 'Smartphone última generación', 499.99, 30),
('Portátil', 'Portátil de alto rendimiento para gaming', 1299.99, 15);

INSERT INTO `ecommerce`.`carrito` (`id_cliente`, `id_producto`, `cantidad`) VALUES
(1, 1, 2),
(2, 2, 1);

INSERT INTO `ecommerce`.`pedidos` (`id_cliente`, `fecha_pedido`, `total`, `estado`) VALUES
(1, '2023-04-05 10:00:00', 999.98, 'procesado'),
(2, '2023-04-06 15:30:00', 1299.99, 'pendiente');

INSERT INTO `ecommerce`.`metodos_pago` (`id_cliente`, `tipo`, `nombre_titular`, `numero_tarjeta`, `fecha_expiracion`, `cvv`, `fecha_registro`) VALUES
(1, 'Tarjeta de Crédito', 'Laura García', 'XXXX-XXXX-XXXX-1234', '2025-12-01', '123', NOW()),
(2, 'Tarjeta de Débito', 'Carlos Martínez', 'XXXX-XXXX-XXXX-5678', '2024-11-01', '456', NOW());

INSERT INTO `ecommerce`.`metodos_pago` (`id_cliente`, `tipo`, `nombre_titular`, `numero_tarjeta`, `fecha_expiracion`, `cvv`, `fecha_registro`) VALUES
(1, 'PayPal', 'Laura García', 'N/A', '2099-01-01', 'N/A', NOW()),
(2, 'Tarjeta de Crédito', 'Carlos Martínez', 'XXXX-XXXX-XXXX-8910', '2026-07-01', '789', NOW());
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
