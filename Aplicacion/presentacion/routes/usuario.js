const express = require('express');
const router = express.Router();
const usuarioService = require('../../logica/services/usuarioService');
const authService = require('../../logica/services/authService');

router.post('/registro', async (req, res) => {
    try {
        const usuario = await usuarioService.registrarUsuario(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/confirmar-registro', async (req, res) => {
    try {
        const { correoelectronico, codigoConfirmacion } = req.body;
        const usuario = await usuarioService.confirmarRegistro(correoelectronico, codigoConfirmacion);
        res.json({ message: 'Confirmación de registro exitosa.', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { correoelectronico, contrasena } = req.body;
        const { usuario, token } = await usuarioService.autenticarUsuario(correoelectronico, contrasena);
        res.json({ usuario, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/recuperar-contrasena', async (req, res) => {
    try {
        const usuario = await usuarioService.recuperarContrasena(req.body.correoelectronico);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verificar-codigo', async (req, res) => {
    try {
        const verificado = await usuarioService.verificarCodigo(req.body.correoelectronico, req.body.codigo);
        if (verificado) {
            res.json({ mensaje: 'Código verificado correctamente' });
        } else {
            res.status(400).json({ error: 'Código inválido' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/establecer-nueva-contrasena', async (req, res) => {
    try {
        const usuario = await usuarioService.establecerNuevaContrasena(req.body.correoelectronico, req.body.nuevaContrasena);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/cambiar-rol', async (req, res) => {
    try {
        const usuario = await usuarioService.cambiarRol(req.body.usuarioid, req.body.rol);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/actualizar', async (req, res) => {
    try {
        const usuario = await usuarioService.actualizarUsuario(req.body.usuarioid, req.body);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/info', async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = authService.verificarToken(token);
        const usuario = await usuarioService.obtenerUsuarioPorId(decoded.usuarioid);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
