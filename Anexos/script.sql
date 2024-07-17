CREATE TABLE usuario (
    usuarioid SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    correoelectronico VARCHAR(100),
    contrasena VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(15),
    rol VARCHAR(20)
);

CREATE TABLE categoria (
    categoriaid SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(255)
);

CREATE TABLE producto (
    productoid SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    precio MONEY,
    cantidadstock INT,
    categoriaid INT,
    imagen BYTEA,
    mostrarp BOOLEAN,
    FOREIGN KEY (categoriaid) REFERENCES categoria(categoriaid)
);

CREATE TABLE pedido (
    pedidoid SERIAL PRIMARY KEY,
    usuarioid INT,
    fechapedido DATE,
    estado VARCHAR(50),
    total FLOAT,
    FOREIGN KEY (usuarioid) REFERENCES usuario(usuarioid)
);

CREATE TABLE pedidoproducto (
    pedidoproductoid SERIAL PRIMARY KEY,
    pedidoid INT,
    productoid INT,
    cantidad INT,
    precio FLOAT,
    FOREIGN KEY (pedidoid) REFERENCES pedido(pedidoid),
    FOREIGN KEY (productoid) REFERENCES producto(productoid)
);

CREATE TABLE carrito (
    carritoid SERIAL PRIMARY KEY,
    usuarioid INT,
    pedidoproductoid INT,
    fechacreacion DATE,
    FOREIGN KEY (usuarioid) REFERENCES usuario(usuarioid),
    FOREIGN KEY (pedidoproductoid) REFERENCES pedidoproducto(pedidoproductoid)
);

CREATE TABLE productoproveedor(
    productoproveedorid SERIAL PRIMARY KEY,
    usuarioid INT NOT NULL,
    nombreproducto VARCHAR(50) NOT NULL,
	descripcionproducto VARCHAR(50) NOT NULL,
	precioproducto MONEY NOT NULL,
	categoriaid INT NOT NULL,
	imagenproducto BYTEA NOT NULL,
    FOREIGN KEY (usuarioid) REFERENCES usuario(usuarioid)
    FOREIGN KEY (categoriaid) REFERENCES categoria(categoriaid)
);

CREATE TABLE feedback (
    feedbackid SERIAL PRIMARY KEY,
    pedidoid INT,
    calificacion INT,
    comentario VARCHAR(255),
    fecha DATE,
    FOREIGN KEY (pedidoid) REFERENCES pedido(pedidoid)
);

CREATE TABLE pago (
    pagoid SERIAL PRIMARY KEY,
    pedidoid INT,
    precio FLOAT,
    fechapago DATE,
    FOREIGN KEY (pedidoid) REFERENCES pedido(pedidoid)
);

CREATE TABLE empresa(
	ruc VARCHAR(13) PRIMARY KEY,
	nombreempresa VARCHAR(100) NOT NULL,
	direccionempresa VARCHAR(255) NOT NULL,
	estadoruc VARCHAR(255) NOT NULL,
	estadoempresa VARCHAR(20) NOT NULL,
	usuarioid INT NOT NULL,
	FOREIGN KEY (usuarioid) REFERENCES usuario(usuarioid)
);

CREATE TABLE productos_temporales(
    productotemporalid SERIAL PRIMARY KEY,
    usuarioid INT NOT NULL,
    nombreproducto VARCHAR(100) NOT NULL,
	descripcionproducto VARCHAR(255) NOT NULL,
	precioproducto MONEY NOT NULL,
	categoriaid INT NOT NULL,
	imagen BYTEA NOT NULL,
	cantidad INT NOT NULL,
    FOREIGN KEY (usuarioid) REFERENCES usuario(usuarioid)
    FOREIGN KEY (categoriaid) REFERENCES categoria(categoriaid)
);

CREATE TABLE recuperacion(
    id SERIAL PRIMARY KEY,
	correoelectronico VARCHAR(100) NOT NULL,
	codigorecuperacion VARCHAR(100) NOT NULL
);

CREATE TABLE tablatememp(
	ruc VARCHAR(13) PRIMARY KEY,
	nombreempresa VARCHAR(100) NOT NULL,
	direccionempresa VARCHAR(255) NOT NULL,
	estadoruc VARCHAR(255) NOT NULL,
	estadoempresa VARCHAR(20) NOT NULL,
	correoelectronico VARCHAR(100) NOT NULL
);

CREATE TABLE tbltuser (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    correoelectronico VARCHAR(100),
    contrasena VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(15),
    rol VARCHAR(20),
	codigoconfirmacion VARCHAR(6)
);

-- Usuario
ALTER TABLE Usuario DROP CONSTRAINT Usuario_pkey CASCADE;
DROP SEQUENCE IF EXISTS usuario_usuarioid_seq;
CREATE SEQUENCE usuario_usuarioid_seq START 1;
ALTER TABLE Usuario ALTER COLUMN UsuarioID SET DEFAULT nextval('usuario_usuarioid_seq');
ALTER TABLE Usuario ADD CONSTRAINT Usuario_pkey PRIMARY KEY (UsuarioID);

-- Categoria
ALTER TABLE Categoria DROP CONSTRAINT Categoria_pkey CASCADE;
DROP SEQUENCE IF EXISTS categoria_categoriaid_seq;
CREATE SEQUENCE categoria_categoriaid_seq START 1;
ALTER TABLE Categoria ALTER COLUMN CategoriaID SET DEFAULT nextval('categoria_categoriaid_seq');
ALTER TABLE Categoria ADD CONSTRAINT Categoria_pkey PRIMARY KEY (CategoriaID);

-- Producto
ALTER TABLE Producto DROP CONSTRAINT Producto_pkey CASCADE;
DROP SEQUENCE IF EXISTS producto_productoid_seq;
CREATE SEQUENCE producto_productoid_seq START 1;
ALTER TABLE Producto ALTER COLUMN ProductoID SET DEFAULT nextval('producto_productoid_seq');
ALTER TABLE Producto ADD CONSTRAINT Producto_pkey PRIMARY KEY (ProductoID);

-- Pedido
ALTER TABLE Pedido DROP CONSTRAINT Pedido_pkey CASCADE;
DROP SEQUENCE IF EXISTS pedido_pedidoid_seq;
CREATE SEQUENCE pedido_pedidoid_seq START 1;
ALTER TABLE Pedido ALTER COLUMN PedidoID SET DEFAULT nextval('pedido_pedidoid_seq');
ALTER TABLE Pedido ADD CONSTRAINT Pedido_pkey PRIMARY KEY (PedidoID);

-- PedidoProducto
ALTER TABLE PedidoProducto DROP CONSTRAINT PedidoProducto_pkey CASCADE;
DROP SEQUENCE IF EXISTS pedidoproducto_pedidoproductoid_seq;
CREATE SEQUENCE pedidoproducto_pedidoproductoid_seq START 1;
ALTER TABLE PedidoProducto ALTER COLUMN PedidoProductoID SET DEFAULT nextval('pedidoproducto_pedidoproductoid_seq');
ALTER TABLE PedidoProducto ADD CONSTRAINT PedidoProducto_pkey PRIMARY KEY (PedidoProductoID);

-- Carrito
ALTER TABLE Carrito DROP CONSTRAINT Carrito_pkey CASCADE;
DROP SEQUENCE IF EXISTS carrito_carritoid_seq;
CREATE SEQUENCE carrito_carritoid_seq START 1;
ALTER TABLE Carrito ALTER COLUMN CarritoID SET DEFAULT nextval('carrito_carritoid_seq');
ALTER TABLE Carrito ADD CONSTRAINT Carrito_pkey PRIMARY KEY (CarritoID);

-- Proveedor
ALTER TABLE Proveedor DROP CONSTRAINT Proveedor_pkey CASCADE;
DROP SEQUENCE IF EXISTS proveedor_proveedorid_seq;
CREATE SEQUENCE proveedor_proveedorid_seq START 1;
ALTER TABLE Proveedor ALTER COLUMN ProveedorID SET DEFAULT nextval('proveedor_proveedorid_seq');
ALTER TABLE Proveedor ADD CONSTRAINT Proveedor_pkey PRIMARY KEY (ProveedorID);

-- InventarioProveedor
ALTER TABLE InventarioProveedor DROP CONSTRAINT InventarioProveedor_pkey CASCADE;
DROP SEQUENCE IF EXISTS inventarioproveedor_inventarioproveedorid_seq;
CREATE SEQUENCE inventarioproveedor_inventarioproveedorid_seq START 1;
ALTER TABLE InventarioProveedor ALTER COLUMN InventarioProveedorID SET DEFAULT nextval('inventarioproveedor_inventarioproveedorid_seq');
ALTER TABLE InventarioProveedor ADD CONSTRAINT InventarioProveedor_pkey PRIMARY KEY (InventarioProveedorID);

-- Feedback
ALTER TABLE Feedback DROP CONSTRAINT Feedback_pkey CASCADE;
DROP SEQUENCE IF EXISTS feedback_feedbackid_seq;
CREATE SEQUENCE feedback_feedbackid_seq START 1;
ALTER TABLE Feedback ALTER COLUMN FeedbackID SET DEFAULT nextval('feedback_feedbackid_seq');
ALTER TABLE Feedback ADD CONSTRAINT Feedback_pkey PRIMARY KEY (FeedbackID);

-- Pago
ALTER TABLE Pago DROP CONSTRAINT Pago_pkey CASCADE;
DROP SEQUENCE IF EXISTS pago_pagoid_seq;
CREATE SEQUENCE pago_pagoid_seq START 1;
ALTER TABLE Pago ALTER COLUMN PagoID SET DEFAULT nextval('pago_pagoid_seq');
ALTER TABLE Pago ADD CONSTRAINT Pago_pkey PRIMARY KEY (PagoID);


CREATE OR REPLACE FUNCTION notify_producto_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('producto_changes', json_build_object(
    'productoid', NEW.productoid,
    'nombre', NEW.nombre,
    'descripcion', NEW.descripcion,
    'precio', NEW.precio,
    'cantidadstock', NEW.cantidadstock,
    'categoriaid', NEW.categoriaid
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER producto_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON producto
FOR EACH ROW EXECUTE FUNCTION notify_producto_changes();

