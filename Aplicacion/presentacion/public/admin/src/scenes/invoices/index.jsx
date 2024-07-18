import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Modal, useTheme   } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";

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
    { field: "categoriaid", headerName: "ID Categoría", type: "number", flex: 1 },
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
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditProduct(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteProduct(params.row.productoid)}
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
      const response = await fetch('/inventario/productos');
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
      const response = await fetch('/inventario/categorias');
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
      const response = await fetch(`/inventario/productos/${productId}`, {
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
    // Aquí deberías implementar la lógica para guardar los cambios del producto seleccionado
    // Usaríamos `selectedProduct` para enviar los datos modificados al servidor
    // Por simplicidad, aquí se debería realizar la llamada a la API para actualizar el producto
    setIsModalOpen(false);
    setSelectedProduct(null);
    cargarProductos(); // Recargar los productos después de modificar
  };

  return (
    <Box m="20px">
      <Header title="Gestión de Inventario" subtitle="Lista de Productos en el Inventario" />

      <Box mt={2} mb={1}>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      </Box>

      <Box height="75vh" width="100%">
        <DataGrid rows={productos} columns={columns} />
      </Box>

      {/* Modal para editar producto */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Editar Producto
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={selectedProduct ? selectedProduct.nombre : ''}
            // onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            value={selectedProduct ? selectedProduct.descripcion : ''}
            // onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio"
            type="number"
            value={selectedProduct ? selectedProduct.precio : ''}
            // onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Cantidad en Stock"
            type="number"
            value={selectedProduct ? selectedProduct.cantidadstock : ''}
            // onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="ID Categoría"
            type="number"
            value={selectedProduct ? selectedProduct.categoriaid : ''}
            // onChange={handleInputChange}
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