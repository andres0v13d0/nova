const express = require('express');
const router = express.Router();
const productoService = require('../../logica/services/productoService');

router.post('/crear', async (req, res) => {
  try {
    const producto = await productoService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/modificar/:id', async (req, res) => {
  try {
    const producto = await productoService.modificarProducto(req.params.id, req.body);
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/eliminar/:id', async (req, res) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
