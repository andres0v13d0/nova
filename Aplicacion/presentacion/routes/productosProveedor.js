const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const productosProveedorService = require('../../logica/services/productosProveedorService');
const authService = require('../../logica/services/authService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.use(authService.autenticacionMiddleware);

router.get('/productos', async (req, res) => {
  try {
    const productos = await productosProveedorService.obtenerProductos(req.usuarioid);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/agregar', upload.single('imagenproducto'), async (req, res) => {
  const data = req.body;
  if (req.file) {
    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Ajusta el tamaño según sea necesario
        .toBuffer();
      data.imagenproducto = compressedImage.toString('base64'); // Convertir a base64
    } catch (err) {
      return res.status(500).json({ error: `Error comprimiendo imagen: ${err.message}` });
    }
  }
  try {
    const producto = await productosProveedorService.agregarProducto(data, req.usuarioid);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productos/:id', upload.single('imagenproducto'), async (req, res) => {
  const productoproveedorid = req.params.id;
  const data = req.body;
  if (req.file) {
    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Ajusta el tamaño según sea necesario
        .toBuffer();
      data.imagenproducto = compressedImage;
    } catch (err) {
      return res.status(500).json({ error: `Error comprimiendo imagen: ${err.message}` });
    }
  }
  try {
    const productoActualizado = await productosProveedorService.modificarProducto(productoproveedorid, data, req.usuarioid);
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productos/:id', async (req, res) => {
  const productoproveedorid = req.params.id;
  try {
    await productosProveedorService.eliminarProducto(productoproveedorid, req.usuarioid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await productosProveedorService.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
