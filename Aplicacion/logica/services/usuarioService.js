const db = require('../../accesodatos');
const bcrypt = require('bcrypt');
const enviarCorreo = require('./emailService');
const generarCodigo = require('./codigoService');
const authService = require('./authService');

const registrarUsuario = async (usuarioData) => {
    try {
        const usuarioExistente = await db.usuario.findOne({ where: { correoelectronico: usuarioData.correoelectronico } });
        if (usuarioExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuarioData.contrasena, saltRounds);
        usuarioData.contrasena = hashedPassword;

        const codigoConfirmacion = generarCodigo();
        usuarioData.codigoConfirmacion = codigoConfirmacion;

        const usuario = await db.usuario.create(usuarioData);

        await enviarCorreo(usuarioData.correoelectronico, 'Confirmación de cuenta', `Tu código de confirmación es: ${codigoConfirmacion}`);

        return usuario;
    } catch (error) {
        throw new Error(`Error registrando el usuario: ${error.message}`);
    }
};

const autenticarUsuario = async (correo, contrasena) => {
    try {
        const usuario = await db.usuario.findOne({ where: { correoelectronico: correo } });
        if (!usuario) throw new Error('Usuario no encontrado');

        const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esValida) throw new Error('Contraseña incorrecta');

        const token = authService.generarToken(usuario);
        return { usuario, token };
    } catch (error) {
        throw new Error(`Error autenticando el usuario: ${error.message}`);
    }
};

const recuperarContrasena = async (correo) => {
    try {
        const usuario = await db.usuario.findOne({ where: { correoelectronico: correo } });
        if (!usuario) throw new Error('Usuario no encontrado');

        const codigoRecuperacion = generarCodigo();
        usuario.codigoRecuperacion = codigoRecuperacion;
        await usuario.save();

        await enviarCorreo(correo, 'Recuperación de contraseña', `Tu código de recuperación es: ${codigoRecuperacion}`);

        return usuario;
    } catch (error) {
        throw new Error(`Error recuperando la contraseña: ${error.message}`);
    }
};

const verificarCodigo = async (correo, codigo) => {
    try {
        const usuario = await db.usuario.findOne({ where: { correoelectronico: correo } });
        if (!usuario) throw new Error('Usuario no encontrado');

        if (usuario.codigoConfirmacion === codigo || usuario.codigoRecuperacion === codigo) {
            usuario.codigoConfirmacion = null;
            usuario.codigoRecuperacion = null;
            await usuario.save();
            return true;
        } else {
            throw new Error('Código inválido');
        }
    } catch (error) {
        throw new Error(`Error verificando el código: ${error.message}`);
    }
};

const establecerNuevaContrasena = async (correo, nuevaContrasena) => {
    try {
        const usuario = await db.usuario.findOne({ where: { correoelectronico: correo } });
        if (!usuario) throw new Error('Usuario no encontrado');

        const salt = await bcrypt.genSalt(10);
        usuario.contrasena = await bcrypt.hash(nuevaContrasena, salt);
        await usuario.save();

        return usuario;
    } catch (error) {
        throw new Error(`Error estableciendo nueva contraseña: ${error.message}`);
    }
};

const obtenerUsuarios = async () => {
    try {
        return await db.usuario.findAll();
    } catch (error) {
        throw new Error(`Error obteniendo los usuarios: ${error.message}`);
    }
};

const cambiarRol = async (usuarioid, nuevoRol) => {
    try {
        const usuario = await db.usuario.findByPk(usuarioid);
        if (!usuario) throw new Error('Usuario no encontrado');

        usuario.rol = nuevoRol;
        await usuario.save();
        return usuario;
    } catch (error) {
        throw new Error(`Error cambiando el rol del usuario: ${error.message}`);
    }
};

const actualizarUsuario = async (usuarioid, usuarioData) => {
    try {
        const usuario = await db.usuario.findByPk(usuarioid);
        if (!usuario) throw new Error('Usuario no encontrado');

        await usuario.update(usuarioData);
        return usuario;
    } catch (error) {
        throw new Error(`Error actualizando el usuario: ${error.message}`);
    }
};

const obtenerUsuarioPorId = async (usuarioid) => {
    try {
        const usuario = await db.usuario.findByPk(usuarioid);
        return usuario;
    } catch (error) {
        throw new Error(`Error obteniendo el usuario: ${error.message}`);
    }
};

module.exports = {
    registrarUsuario,
    autenticarUsuario,
    recuperarContrasena,
    verificarCodigo,
    establecerNuevaContrasena,
    obtenerUsuarios,
    cambiarRol,
    actualizarUsuario,
    obtenerUsuarioPorId
};
