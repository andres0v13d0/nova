import React, { useState } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';

const Reportes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reportes] = useState([
    { id: 1, descripcion: "Reporte del Catálogo de Productos", tipo: 'productos' },
    { id: 2, descripcion: "Reporte de Clientes Existentes", tipo: 'clientes' },
    { id: 3, descripcion: "Reporte de Proveedores de la Tienda", tipo: 'proveedores' },
    { id: 4, descripcion: "Reporte de Ventas Realizadas", tipo: 'ventas' },
    { id: 5, descripcion: "Reporte de Retroalimentaciones", tipo: 'feedback' },
  ]);

  const handleGenerarReporte = async (tipo) => {
    try {
      const response = await axios.get(`http://localhost:3200/reportes/generar/${tipo}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${tipo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generando reporte:", error);
    }
  };

  const columns = [
    {
      field: "descripcion",
      headerName: "Descripción del Reporte",
      flex: 1,
      cellClassName: "description-column--cell",
    },
    {
      field: "generar",
      headerName: "Acciones",
      sortable: false,
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleGenerarReporte(params.row.tipo)}
        >
          <PictureAsPdfIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Generación de Reportes"
        subtitle="Utilice esta sección para generar diversos reportes de gestión"
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
          "& .description-column--cell": {
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
        }}
      >
        <DataGrid rows={reportes} columns={columns} getRowId={(row) => row.id} />
      </Box>
    </Box>
  );
};

export default Reportes;
