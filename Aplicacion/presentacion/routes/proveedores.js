const express = require('express');
const router = express.Router();
const proveedoresService = require('../../logica/services/proveedoresService');

router.get('/listar', async (req, res) => {
    try {
        const proveedores = await proveedoresService.listarProveedores();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/agregar', async (req, res) => {
    try {
        const proveedor = await proveedoresService.agregarProveedor(req.body);
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/modificar/:id', async (req, res) => {
    try {
        const proveedor = await proveedoresService.modificarProveedor(req.params.id, req.body);
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    try {
        await proveedoresService.eliminarProveedor(req.params.id);
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
