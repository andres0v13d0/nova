import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Modal, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Invoices = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.value.toFixed(2)}
        </Typography>
      ),
    },
    { field: "cantidadstock", headerName: "Stock", type: "number", flex: 1 },
    { field: "nombre", headerName: "Categoría", flex: 1 },
    {
      field: "imagen",
      headerName: "Imagen",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img src={`data:image/png;base64,${params.value}`} alt="Product" style={{ width: 100 }} />
        ) : null,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="10px">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEditProduct(params.row)}
            startIcon={<EditIcon />}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteProduct(params.row.productoid)}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:3200/inventario/productos');
      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }
      const data = await response.json();
      setProductos(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3200/inventario/categorias');
      if (!response.ok) {
        throw new Error("Error al cargar categorías");
      }
      const data = await response.json();
      setCategorias(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3200/inventario/productos/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }
      cargarProductos();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedProduct) return;
    try {
      const response = await fetch(`http://localhost:3200/inventario/productos/${selectedProduct.productoid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedProduct)
      });
      if (!response.ok) {
        throw new Error("Error al guardar cambios del producto");
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
      cargarProductos();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box m="20px">
      <Header title="Gestión de Inventario" subtitle="Lista de Productos en el Inventario" />
      <Box height="75vh" width="100%">
        <DataGrid rows={productos} columns={columns} getRowId={(row) => row.productoid} />
      </Box>

      {/* Modal para editar producto */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            {selectedProduct ? "Editar Producto" : "Agregar Producto"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="nombre"
            value={selectedProduct ? selectedProduct.nombre : ''}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={selectedProduct ? selectedProduct.descripcion : ''}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio"
            type="number"
            name="precio"
            value={selectedProduct ? selectedProduct.precio : ''}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Cantidad en Stock"
            type="number"
            name="cantidadstock"
            value={selectedProduct ? selectedProduct.cantidadstock : ''}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="ID Categoría"
            type="number"
            name="categoriaid"
            value={selectedProduct ? selectedProduct.categoriaid : ''}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {error && (
        <Typography variant="body1" color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Invoices;
