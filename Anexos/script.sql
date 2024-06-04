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
    Imagen VARCHAR(255),
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
