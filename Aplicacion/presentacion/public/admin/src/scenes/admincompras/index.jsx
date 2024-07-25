import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import QRModal from "./QrModal"; // Asegúrate de que la ruta sea correcta

const AdminCompras = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [buscar, setBuscar] = useState("");
  const [error, setError] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [productosRes, categoriasRes, empresasRes] = await Promise.all([
          fetch('http://localhost:3200/compras/productos', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3200/compras/categorias', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3200/compras/empresas', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!productosRes.ok || !categoriasRes.ok || !empresasRes.ok) {
          throw new Error('Error fetching data');
        }

        const [productosData, categoriasData, empresasData] = await Promise.all([
          productosRes.json(),
          categoriasRes.json(),
          empresasRes.json()
        ]);

        setProductos(productosData);
        setCategorias(categoriasData);
        setEmpresas(empresasData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleBuscar = (event) => {
    setBuscar(event.target.value.toLowerCase());
  };

  const handleFiltrarCategoria = (event) => {
    setCategoriaId(event.target.value);
  };

  const handleFiltrarEmpresa = (event) => {
    setEmpresaId(event.target.value);
  };

  const agregarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find(
      (p) => p.nombreproducto === producto.nombreproducto
    );
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      producto.cantidad = 1;
      setCarrito([...carrito, producto]);
    }
  };

  const removerDelCarrito = (producto) => {
    setCarrito(carrito.filter((p) => p !== producto));
  };

  const mostrarProductos = () => {
    const productosFiltrados = productos.filter((producto) => {
      const categoriaMatch =
        !categoriaId ||
        producto.categoria.nombre ===
          categorias.find((c) => c.categoriaid === categoriaId)?.nombre;
      const empresaMatch =
        !empresaId ||
        producto.proveedor.empresa.nombreempresa ===
          empresas.find((e) => e.usuarioid === empresaId)?.nombreempresa;
      const buscarMatch = producto.nombreproducto.toLowerCase().includes(buscar);
      return categoriaMatch && empresaMatch && buscarMatch;
    });

    return (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Dueño</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosFiltrados.map((producto, index) => (
              <TableRow key={index}>
                <TableCell>{producto.nombreproducto}</TableCell>
                <TableCell>{producto.descripcionproducto}</TableCell>
                <TableCell>{producto.precioproducto}</TableCell>
                <TableCell>{producto.categoria.nombre}</TableCell>
                <TableCell>{producto.proveedor.empresa.nombreempresa}</TableCell>
                <TableCell>{producto.proveedor.nombre}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al Carrito
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const mostrarCarrito = () => (
    <Box sx={{ marginTop: 2 }}>
      {carrito.map((producto, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {producto.nombreproducto}
            </Typography>
            <Typography>
              Cantidad: {producto.cantidad} - Precio: {producto.precioproducto}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => removerDelCarrito(producto)}
            >
              Eliminar
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  const handlePedidoRecibido = () => {
    setQrModalOpen(true);
  };

  const handleModalClose = () => {
    setQrModalOpen(false);
  };

  const handleScanSuccess = async (nombreEmpresa) => {
    console.log(`Producto recibido de: ${nombreEmpresa}`);

    try {
      const response = await fetch('http://localhost:3200/compras/marcar-recibido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombreEmpresa })
      });

      if (!response.ok) {
        throw new Error('Error al marcar el producto como recibido');
      }

      const result = await response.json();
      console.log('Producto marcado como recibido:', result);

      // Aquí puedes actualizar el estado para reflejar los cambios en la UI
      const nuevosProductos = productos.map((producto) => {
        if (producto.proveedor.empresa.nombreempresa === nombreEmpresa) {
          return { ...producto, recibido: true };
        }
        return producto;
      });

      setProductos(nuevosProductos);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin={2}
        padding={2}
        component={Paper}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom>
          Administración de Compras
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom={2}
          width="100%"
        >
          <TextField
            label="Buscar Producto"
            variant="outlined"
            value={buscar}
            onChange={handleBuscar}
            margin="normal"
            fullWidth
          />
          <Select
            value={categoriaId}
            onChange={handleFiltrarCategoria}
            displayEmpty
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Todas las Categorías</MenuItem>
            {categorias.map((categoria) => (
              <MenuItem key={categoria.categoriaid} value={categoria.categoriaid}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={empresaId}
            onChange={handleFiltrarEmpresa}
            displayEmpty
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Todas las Empresas</MenuItem>
            {empresas.map((empresa) => (
              <MenuItem key={empresa.usuarioid} value={empresa.usuarioid}>
                {empresa.nombreempresa}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {mostrarProductos()}
        <Typography variant="h5" gutterBottom>
          Carrito de Compras
        </Typography>
        {mostrarCarrito()}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          marginTop={2}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => alert("Compra Finalizada")}
          >
            Finalizar Compra
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePedidoRecibido}
          >
            Recibir Pedido
          </Button>
        </Box>
        <QRModal
          open={qrModalOpen}
          onClose={handleModalClose}
          onScanSuccess={handleScanSuccess}
        />
      </Box>
    </Container>
  );
};

export default AdminCompras;
