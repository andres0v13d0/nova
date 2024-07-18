import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
//import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
//import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
//import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/usuario/usuarios', {
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

  const handleEditClick = (id) => {
    // Lógica para manejar la acción de editar aquí
    console.log("Editar usuario con ID:", id);
  };

  const handleDeleteClick = async (id) => {
    // Lógica para manejar la acción de eliminar aquí
    const token = localStorage.getItem('token');
    const response = await fetch('/usuario/eliminar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ usuarioid: id })
    });

    if (response.ok) {
      alert('Usuario eliminado');
      setUsers(users.filter(user => user.usuarioid !== id));
    } else {
      console.error('Error eliminando el usuario');
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
      field: "edit",
      headerName: "Editar",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton aria-label="editar" onClick={() => handleEditClick(params.row.usuarioid)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Eliminar",
      sortable: false,
      width: 120,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton aria-label="eliminar" onClick={() => handleDeleteClick(params.row.usuarioid)}>
          <DeleteIcon />
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
