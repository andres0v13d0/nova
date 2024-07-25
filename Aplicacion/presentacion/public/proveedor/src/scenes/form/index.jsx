import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [imagePreview, setImagePreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3200/productosProveedor/categorias', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategorias(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('nombreproducto', values.nombre);
    formData.append('precioproducto', values.precio);
    formData.append('descripcionproducto', values.descripcion);
    formData.append('categoriaid', values.categoria);
    formData.append('imagenproducto', values.file);

    try {
      const response = await axios.post('http://localhost:3200/productosProveedor/agregar', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      resetForm();
      setImagePreview(null);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Nuevo Producto" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre de producto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Precio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.precio}
                name="precio"
                error={!!touched.precio && !!errors.precio}
                helperText={touched.precio && errors.precio}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripción"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  id="categoria"
                  name="categoria"
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.categoria && !!errors.categoria}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.categoriaid} value={categoria.categoriaid}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                component="label"
                color="secondary"
                sx={{ gridColumn: "span 1", mt: "20px" }}
              >
                Seleccionar imagen
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("file", file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </Button>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Vista previa"
                  sx={{ gridColumn: "span 4", mt: "20px", maxHeight: "300px" }}
                />
              )}
              {touched.file && errors.file && (
                <div className="error">{errors.file}</div>
              )}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Agregar producto
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Producto agregado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  nombre: yup.string().required("Nombre es requerido"),
  precio: yup
    .number()
    .typeError("Debe ser un número")
    .required("Precio es requerido"),
  descripcion: yup.string().required("Descripción es requerida"),
  categoria: yup.string().required("Categoría es requerida"),
  file: yup
    .mixed()
    .required("Imagen es requerida")
    .test("fileSize", "El archivo es muy grande", (value) => {
      return value && value.size <= 2000000;
    })
    .test("fileType", "Solo se permite formato de imagen", (value) => {
      return (
        value &&
        ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
          value.type
        )
      );
    }),
});

const initialValues = {
  nombre: "",
  precio: "",
  descripcion: "",
  categoria: "",
  file: null,
};

export default Form;
