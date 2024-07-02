const express = require('express');
const router = express.Router();
const comprasService = require('../../logica/services/comprasService');
const authService = require('../../logica/services/authService');

router.use(authService.autenticacionMiddleware);

router.get('/productos', async (req, res) => {
    try {
        const productos = await comprasService.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categorias', async (req, res) => {
    try {
        const categorias = await comprasService.obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/empresas', async (req, res) => {
    try {
        const empresas = await comprasService.obtenerEmpresas();
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/finalizar', async (req, res) => {
    try {
        const adminId = authService.obtenerUsuarioId(req);
        const { carrito } = req.body;
        if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }
        const result = await comprasService.finalizarCompra(carrito, adminId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/recibido', async (req, res) => {
    try {
        const adminId = authService.obtenerUsuarioId(req);
        const result = await comprasService.marcarPedidoRecibido(adminId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
