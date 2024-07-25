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
  Snackbar,
  Alert,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import QRCodeIcon from '@mui/icons-material/QrCode';
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      (p) => p.productoproveedorid === producto.productoproveedorid
    );
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      producto.cantidad = 1;
      setCarrito([...carrito, producto]);
    }
    mostrarCarrito();
  };

  const removerDelCarrito = (producto) => {
    setCarrito(carrito.filter((p) => p !== producto));
  };

  const mostrarProductos = (productosAMostrar) => {
    const productosFiltrados = productosAMostrar || productos.filter((producto) => {
      const categoriaMatch =
        !categoriaId ||
        producto.categoria.nombre ===
          categorias.find((c) => c.categoriaid === categoriaId)?.nombre;
      const empresaMatch =
        !empresaId ||
        (producto.proveedor?.empresa?.nombreempresa ===
          empresas.find((e) => e.usuarioid === empresaId)?.nombreempresa);
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
              <TableCell>Imagen</TableCell>
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
                <TableCell>
                  <img
                    src={`data:image/png;base64,${producto.imagenproducto}`}
                    alt={producto.nombreproducto}
                    width="50"
                    height="50"
                  />
                </TableCell>
                <TableCell>{producto.categoria.nombre}</TableCell>
                <TableCell>{producto.proveedor?.empresa?.nombreempresa || 'N/A'}</TableCell>
                <TableCell>{producto.proveedor?.nombre || 'N/A'}</TableCell>
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
    <List>
      {carrito.map((producto, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={`${producto.nombreproducto} - ${producto.cantidad} x ${producto.precioproducto}`}
          />
          <IconButton
            edge="end"
            aria-label="delete"
            color="secondary"
            onClick={() => removerDelCarrito(producto)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
      <Divider />
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={finalizarCompra}
        sx={{ mt: 2 }}
      >
        Finalizar Compra
      </Button>
    </List>
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
      const response = await fetch('http://localhost:3200/compras/recibido', {
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
        if (producto.proveedor?.empresa?.nombreempresa === nombreEmpresa) {
          return { ...producto, recibido: true };
        }
        return producto;
      });

      setProductos(nuevosProductos);

    } catch (error) {
      setError(error.message);
    }
  };

  const finalizarCompra = async () => {
    try {
      if (carrito.length === 0) {
        alert('El carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
      }

      const carritoLimpio = carrito.map(producto => ({
        ...producto,
        precioproducto: limpiarPrecio(producto.precioproducto)
      }));

      console.log('Carrito al finalizar compra:', carritoLimpio);
      const response = await fetch('http://localhost:3200/compras/finalizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ carrito: carritoLimpio })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert('Compra finalizada exitosamente');
      setCarrito([]);
      setDrawerOpen(false);
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const limpiarPrecio = (precio) => {
    let precioLimpio = precio.replace(/[^0-9.-]+/g, "");
    let precioNumerico = parseFloat(precioLimpio);
    return isNaN(precioNumerico) ? 0 : precioNumerico;
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
          justifyContent="flex-end"
          width="100%"
          mb={2}
        >
          <IconButton color="primary" onClick={() => setDrawerOpen(true)}>
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handlePedidoRecibido}>
            <QRCodeIcon />
          </IconButton>
        </Box>
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
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{ width: 300, padding: 2 }}
            role="presentation"
          >
            <Typography variant="h6" gutterBottom>
              Carrito de Compras
            </Typography>
            {mostrarCarrito()}
          </Box>
        </Drawer>
        <QRModal
          open={qrModalOpen}
          onClose={handleModalClose}
          onScanSuccess={handleScanSuccess}
        />
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            Compra finalizada exitosamente!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AdminCompras;
