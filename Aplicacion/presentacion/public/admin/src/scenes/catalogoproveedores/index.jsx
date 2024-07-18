import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  InputAdornment,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Catalogoproveedores = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [buscarProducto, setBuscarProducto] = useState("");

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarEmpresas();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('/compras/productos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/compras/categorias', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const cargarEmpresas = async () => {
    try {
      const response = await fetch('/compras/empresas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const handleBuscarProducto = (event) => {
    setBuscarProducto(event.target.value.toLowerCase());
  };

  const handleFiltrarCategoria = (event) => {
    setFiltroCategoria(event.target.value);
  };

  const handleFiltrarEmpresa = (event) => {
    setFiltroEmpresa(event.target.value);
  };

  const columns = [
    { field: "productoproveedorid", headerName: "Producto ID" },
    { field: "usuarioid", headerName: "ID Usuario", type: "number" },
    { field: "nombreproducto", headerName: "Nombre Producto", flex: 1 },
    { field: "descripcionproducto", headerName: "Descripción", flex: 1 },
    {
      field: "precioproducto",
      headerName: "Precio",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.precioproducto}
        </Typography>
      ),
    },
    { field: "categoriaid", headerName: "ID Categoría", type: "number" },
    { field: "imagenproducto", headerName: "Imagen", flex: 1 },
  ];

  const productosFiltrados = productos.filter((producto) => {
    const categoriaMatch =
      !filtroCategoria || producto.categoriaid === parseInt(filtroCategoria);
    const empresaMatch =
      !filtroEmpresa || producto.usuarioid === parseInt(filtroEmpresa);
    const buscarMatch = producto.nombreproducto
      .toLowerCase()
      .includes(buscarProducto);

    return categoriaMatch && empresaMatch && buscarMatch;
  });

  return (
    <Box m="20px">
      <Header
        title="Catálogo de Proveedores"
        subtitle="Productos ofrecidos por los proveedores"
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        flexWrap="wrap"
        gap="20px"
        mb="20px"
      >
        <TextField
          label="Buscar Producto"
          variant="outlined"
          value={buscarProducto}
          onChange={handleBuscarProducto}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
          margin="normal"
          style={{ flex: 1 }}
        />
        <TextField
          select
          label="Filtrar por Categoría"
          value={filtroCategoria}
          onChange={handleFiltrarCategoria}
          variant="outlined"
          margin="normal"
          style={{ flex: 1 }}
        >
          <MenuItem value="">Todas las Categorías</MenuItem>
          {categorias.map((categoria) => (
            <MenuItem key={categoria.categoriaid} value={categoria.categoriaid}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filtrar por Empresa"
          value={filtroEmpresa}
          onChange={handleFiltrarEmpresa}
          variant="outlined"
          margin="normal"
          style={{ flex: 1 }}
        >
          <MenuItem value="">Todas las Empresas</MenuItem>
          {empresas.map((empresa) => (
            <MenuItem key={empresa.usuarioid} value={empresa.usuarioid}>
              {empresa.nombreempresa}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={productosFiltrados}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Catalogoproveedores;

