const db = require('../../accesodatos');

const obtenerDatosTabla = async (tabla) => {
    try {
        const resultados = await db[tabla].findAll();
        return resultados;
    } catch (error) {
        throw new Error(`Error obteniendo datos de la tabla ${tabla}: ${error.message}`);
    }
};

module.exports = {
    obtenerDatosTabla,
};
