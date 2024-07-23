import React from 'react';
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3200/usuario/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChangeClick = async (id, currentRole) => {
    const newRole = currentRole === 'cliente' ? 'administrador' : 'cliente';
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3200/usuario/cambiar-rol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ usuarioid: id, rol: newRole })
    });

    if (response.ok) {
      alert(`Rol cambiado a ${newRole}`);
      setUsers(users.map(user => 
        user.usuarioid === id ? { ...user, rol: newRole } : user
      ));
    } else {
      console.error('Error cambiando el rol del usuario');
    }
  };

  const columns = [
    { field: "usuarioid", headerName: "ID" },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "correoelectronico",
      headerName: "Correo Electrónico",
      flex: 1,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1,
    },
    {
      field: "telefono",
      headerName: "Telefono",
      flex: 1,
    },
    {
      field: "rol",
      headerName: "Rol",
      flex: 1,
    },
    {
      field: "changeRole",
      headerName: "Cambiar Rol",
      sortable: false,
      width: 160,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton 
          aria-label="cambiar rol" 
          onClick={() => handleRoleChangeClick(params.row.usuarioid, params.row.rol)}
        >
          {params.row.rol === 'cliente' ? 'Cambiar a Administrador' : 'Cambiar a Cliente'}
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Usuarios" subtitle="Gestión de usuarios en NOVA" />
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
        }}
      >
        <DataGrid checkboxSelection rows={users} columns={columns} getRowId={(row) => row.usuarioid} />
      </Box>
    </Box>
  );
};

export default Team;
