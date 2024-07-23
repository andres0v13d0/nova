import React, { useState } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Reportes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reportes] = useState([
    { id: 1, descripcion: "Reporte del Catálogo de Productos" },
    { id: 2, descripcion: "Reporte de Clientes Existentes" },
    { id: 3, descripcion: "Reporte de Proveedores de la Tienda" },
    { id: 4, descripcion: "Reporte de Ventas Realizadas" },
    { id: 5, descripcion: "Reporte de Retroalimentaciones" },
  ]);

  const handleGenerarReporte = (id) => {
    // Lógica para generar el reporte
    console.log("Generar reporte con ID:", id);
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGenerarReporte(params.row.id)}
        >
          Generar Reporte
        </Button>
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

