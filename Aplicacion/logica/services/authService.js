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

module.exports = {
    generarToken,
    verificarToken
};
