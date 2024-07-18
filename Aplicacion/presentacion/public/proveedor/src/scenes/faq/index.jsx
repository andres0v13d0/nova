import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Necesitas Ayuda" subtitle="Preguntas Frecuentes  " />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          ¿Qué información necesito para completar el formulario?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Necesitará información sobre el producto que oferta, como nombre, descripción, precio, categoría, imágenes, etc. 
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          ¿Cómo puedo agregar varias imágenes de un producto?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Deberá seleccionar la opción para "agregar imágenes" y luego seleccionar las imágenes que desea cargar desde su computadora.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          ¿Qué pasa si cometo un error al completar el formulario?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Puede eliminar productos o comenzar de nuevo si es necesario.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          ¿Cómo sé si mi producto ha sido agregado correctamente?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Recibirá una notificación por correo electrónico o dentro del sistema cuando su producto haya sido agregado correctamente.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          ¿Qué debo ingresar en el campo "nombre del producto"?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          El nombre del producto debe ser descriptivo y fácil de entender. Debe incluir las palabras clave que los clientes usarían para buscar el producto.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
