const express = require('express');
const router = express.Router();
const reportesService = require('../../logica/services/reportesService');

router.get('/obtener/:tabla', async (req, res) => {
    try {
        const tabla = req.params.tabla;
        const datos = await reportesService.obtenerDatosTabla(tabla);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
