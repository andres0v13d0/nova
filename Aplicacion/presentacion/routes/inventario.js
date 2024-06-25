const express = require('express');
const multer = require('multer');
const router = express.Router();
const inventarioService = require('../../logica/services/inventarioService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
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
    data.imagen = req.file.buffer.toString('base64');
  }
  try {
    const producto = await inventarioService.agregarProducto(data);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productos/:id', upload.single('imagen'), async (req, res) => {
  const productoid = req.params.id;
  const data = req.body;
  if (req.file) {
    data.imagen = req.file.buffer.toString('base64');
  }
  try {
    const productoActualizado = await inventarioService.modificarProducto(productoid, data);
    res.json(productoActualizado);
  } catch (error) {
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

module.exports = router;
