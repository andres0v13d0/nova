const express = require('express');
const router = express.Router();
const ventasService = require('../../logica/services/ventasService');

router.post('/venta', async (req, res) => {
    try {
        const venta = await ventasService.registrarVenta(req.body);
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
