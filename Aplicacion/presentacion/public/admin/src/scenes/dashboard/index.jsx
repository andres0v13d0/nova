import React from 'react';
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Inicio" subtitle="Vista del Dashboard" />
      </Box>
      {/* WELCOME SECTION */}
      <Paper elevation={3} sx={{ p: "20px", mb: "20px" }}>
        <Typography variant="h4" fontWeight="bold" mb="10px">
          Bienvenido Administrador
        </Typography>
        <Typography variant="subtitle1" color={colors.grey[600]}>
          Aquí encontrará las funciones princioales para gestionar esta tienda.
        </Typography>
      </Paper>

      
    </Box>
  );
};

export default Dashboard;