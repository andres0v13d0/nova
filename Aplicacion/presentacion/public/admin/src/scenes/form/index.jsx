import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    correoelectronico: "",
    contrasena: "",
    direccion: "",
    telefono: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3200/usuario/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const usuario = await response.json();
        setUsuario(usuario);
      } else {
        console.error('Error fetching user info');
      }
    };
    fetchUserInfo();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3200/usuario/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...values, usuarioid: usuario.usuarioid })
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Información actualizada exitosamente');
    } catch (error) {
      setError(error.message);
    }
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    apellido: yup.string().required("Apellido es requerido"),
    correoelectronico: yup.string().email("Correo electrónico no es válido").required("Correo electrónico es requerido"),
    contrasena: yup.string().required("Contraseña es requerida"),
    direccion: yup.string().required("Dirección es requerida"),
    telefono: yup.string().matches(/^\d+$/, "El teléfono debe ser un número").required("Teléfono es requerido"),
  });

  return (
    <Box m="20px">
      <Header title="Actualizar Información" />
      <Formik
        initialValues={usuario}
        enableReinitialize
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, 1fr)"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                error={!!touched.apellido && !!errors.apellido}
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Correo Electrónico"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.correoelectronico}
                name="correoelectronico"
                error={!!touched.correoelectronico && !!errors.correoelectronico}
                helperText={touched.correoelectronico && errors.correoelectronico}
                disabled
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contrasena}
                name="contrasena"
                error={!!touched.contrasena && !!errors.contrasena}
                helperText={touched.contrasena && errors.contrasena}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Teléfono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono}
                name="telefono"
                error={!!touched.telefono && !!errors.telefono}
                helperText={touched.telefono && errors.telefono}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            {error && <Box mt="20px" color="red">{error}</Box>}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Actualizar Información
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
