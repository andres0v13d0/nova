import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const Productos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3200/productosProveedor/productos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const productosWithId = response.data.map((producto, index) => ({
          ...producto,
          id: producto.id || index  // Add a unique id if not already present
        }));
        setProductos(productosWithId);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const columns = [
    {
      field: "nombreproducto",
      headerName: "Nombre del producto",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "precioproducto",
      headerName: "Precio",
      flex: 1,
    },
    {
      field: "descripcionproducto",
      headerName: "Descripción",
      flex: 3,
    },
    {
      field: "imagenproducto",
      headerName: "Imagen",
      flex: 3,
      renderCell: (params) => {
        if (params.value) {
          return <img src={`data:image/png;base64,${params.value}`} alt="product" width={100} />;
        } else {
          return null;
        }
      },
    }
  ];

  return (
    <Box m="20px">
      <Header
        title="Productos"
        subtitle="Lista de productos agregados"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={productos}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Productos;
