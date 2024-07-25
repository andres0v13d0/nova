const express = require('express');
const router = express.Router();
const proveedorService = require('../../logica/services/proveedorService');

router.post('/registrar', async (req, res) => {
    try {
        const { usuario, empresa } = req.body;
        const result = await proveedorService.registrarUsuarioYEmpresa(usuario, empresa);
        res.json(result);
    } catch (error) {
        console.error('Error en /registrar:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/confirmar', async (req, res) => {
    try {
        const result = await proveedorService.confirmarRegistro(req.body.correo, req.body.codigo);
        res.json(result);
    } catch (error) {
        console.error('Error en /confirmar:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/buscarRuc/:ruc', async (req, res) => {
    try {
        const result = await proveedorService.buscarRuc(req.params.ruc);
        res.json(result);
    } catch (error) {
        console.error('Error en /buscarRuc:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.put('/actualizarEmpresa/:ruc', async (req, res) => {
    try {
        const result = await proveedorService.actualizarEmpresa(req.params.ruc, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/listarProveedores', async (req, res) => {
    try {
        const result = await proveedorService.listarProveedores();
        res.json(result);
    } catch (error) {
        console.error('Error en /listarProveedores:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
