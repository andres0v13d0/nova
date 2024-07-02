const express = require('express');
const router = express.Router();
const catalogoService = require('../../logica/services/catalogoService');

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await catalogoService.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productos', async (req, res) => {
  const { nombre, categoria, precioMin, precioMax } = req.query;
  try {
    const productos = await catalogoService.filtrarProductos(nombre, categoria, precioMin, precioMax);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productos/:id', async (req, res) => {
  const productoid = req.params.id;
  try {
    const producto = await catalogoService.obtenerProductoPorId(productoid);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
