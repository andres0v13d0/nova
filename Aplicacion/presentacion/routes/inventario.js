const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const inventarioService = require('../../logica/services/inventarioService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get('/productos', async (req, res) => {
  try {
    const productos = await inventarioService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/productos', upload.single('imagen'), async (req, res) => {
  const data = req.body;
  if (req.file) {
    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Ajusta el tamaño según sea necesario
        .toBuffer();
      console.log(`Tamaño de la imagen comprimida: ${compressedImage.length} bytes`);
      data.imagen = compressedImage.toString('base64'); // Convertir a base64
    } catch (err) {
      console.error(`Error comprimiendo imagen: ${err.message}`);
      return res.status(500).json({ error: `Error comprimiendo imagen: ${err.message}` });
    }
  }
  try {
    console.log(`Datos del producto antes de guardar:`, data);
    const producto = await inventarioService.agregarProducto(data);
    res.json(producto);
  } catch (error) {
    console.error(`Error al agregar producto: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.put('/productos/:id', upload.single('imagen'), async (req, res) => {
  const productoid = req.params.id;
  const data = req.body;
  if (req.file) {
    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Ajusta el tamaño según sea necesario
        .toBuffer();
      console.log(`Tamaño de la imagen comprimida: ${compressedImage.length} bytes`);
      data.imagen = compressedImage;
    } catch (err) {
      console.error(`Error comprimiendo imagen: ${err.message}`);
      return res.status(500).json({ error: `Error comprimiendo imagen: ${err.message}` });
    }
  }
  try {
    console.log(`Datos del producto antes de actualizar:`, data);
    const productoActualizado = await inventarioService.modificarProducto(productoid, data);
    res.json(productoActualizado);
  } catch (error) {
    console.error(`Error al modificar producto: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productos/:id', async (req, res) => {
  const productoid = req.params.id;
  try {
    await inventarioService.eliminarProducto(productoid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await inventarioService.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categorias', async (req, res) => {
  const data = req.body;
  try {
    const categoria = await inventarioService.agregarCategoria(data);
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
