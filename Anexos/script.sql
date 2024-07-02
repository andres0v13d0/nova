CREATE TABLE Usuario (
    UsuarioID INT PRIMARY KEY,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50),
    CorreoElectronico VARCHAR(100),
    Contrasena VARCHAR(255),
    Direccion VARCHAR(255),
    Telefono VARCHAR(15),
    Rol VARCHAR(20)
);

CREATE TABLE Categoria (
    CategoriaID INT PRIMARY KEY,
    Nombre VARCHAR(50),
    Descripcion VARCHAR(255)
);

CREATE TABLE Producto (
    ProductoID INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Descripcion VARCHAR(255),
    Precio MONEY,
    CantidadStock INT,
    CategoriaID INT,
    Imagen BYTEA,
    FOREIGN KEY (CategoriaID) REFERENCES Categoria(CategoriaID)
);

CREATE TABLE Pedido (
    PedidoID INT PRIMARY KEY,
    UsuarioID INT,
    FechaPedido DATE,
    Estado VARCHAR(50),
    Total FLOAT,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID)
);

CREATE TABLE PedidoProducto (
    PedidoProductoID INT PRIMARY KEY,
    PedidoID INT,
    ProductoID INT,
    Cantidad INT,
    Precio FLOAT,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID),
    FOREIGN KEY (ProductoID) REFERENCES Producto(ProductoID)
);

CREATE TABLE Carrito (
    CarritoID INT PRIMARY KEY,
    UsuarioID INT,
    PedidoProductoID INT,
    FechaCreacion DATE,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID),
    FOREIGN KEY (PedidoProductoID) REFERENCES PedidoProducto(PedidoProductoID)
);


CREATE TABLE Proveedor (
    ProveedorID INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Telefono VARCHAR(15),
    CorreoElectronico VARCHAR(100)
);

CREATE TABLE InventarioProveedor (
    InventarioProveedorID INT PRIMARY KEY,
    ProductoID INT,
    ProveedorID INT,
    CantidadSuministrada INT,
    PrecioEntrega MONEY,
    FechaSuministro DATE,
    FOREIGN KEY (ProductoID) REFERENCES Producto(ProductoID),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedor(ProveedorID)
);

CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY,
    PedidoID INT,
    Calificacion INT,
    Comentario VARCHAR(255),
    Fecha DATE,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID)
);

CREATE TABLE Pago (
    PagoID INT PRIMARY KEY,
    PedidoID INT,
    Precio FLOAT,
    FechaPago DATE,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID)
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

