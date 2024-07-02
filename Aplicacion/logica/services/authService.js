const jwt = require('jsonwebtoken');
const SECRET_KEY = 'llave_secreta';

const generarToken = (usuario) => {
    const payload = {
        usuarioid: usuario.usuarioid,
        nombre: usuario.nombre
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const verificarToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

const obtenerUsuarioId = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }

    const decodedToken = verificarToken(token);
    return decodedToken.usuarioid;
};

const autenticacionMiddleware = (req, res, next) => {
    try {
        req.usuarioid = obtenerUsuarioId(req);
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = {
    generarToken,
    verificarToken,
    obtenerUsuarioId,
    autenticacionMiddleware
};
