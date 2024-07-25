import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from 'axios';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:3200/proveedor/listarProveedores');
        // Añade una propiedad id a cada fila usando el valor de ruc
        const proveedoresConId = response.data.map(proveedor => ({
          ...proveedor,
          id: proveedor.ruc
        }));
        setRows(proveedoresConId);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  const columns = [
    { field: "ruc", headerName: "RUC", flex: 0.5 },
    { field: "nombreempresa", headerName: "Nombre Empresa" },
    {
      field: "direccion",
      headerName: "Direccion",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "estadoruc",
      headerName: "Estado RUC",
      flex: 1,
    },
    {
      field: "estadoempresa",
      headerName: "Estado Empresa",
      flex: 1,
    },
    {
      field: "nombre",
      headerName: "Dueño",
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Proveedores"
        subtitle="Lista de los proveedores de NOVA"
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
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
