import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [imagePreview, setImagePreview] = useState(null);

  const handleFormSubmit = (values) => {
    console.log(values);
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Categoría"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoria}
                name="categoria"
                error={!!touched.categoria && !!errors.categoria}
                helperText={touched.categoria && errors.categoria}
                sx={{ gridColumn: "span 4" }}
              />
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
