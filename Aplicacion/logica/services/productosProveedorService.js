const db = require('../../accesodatos');

const obtenerProductos = async (usuarioid) => {
    try {
        return await db.productoproveedor.findAll({ where: { usuarioid } });
    } catch (error) {
        throw new Error(`Error obteniendo productos: ${error.message}`);
    }
};

const agregarProducto = async (data, usuarioid) => {
    try {
        data.usuarioid = usuarioid;
        return await db.productoproveedor.create(data);
    } catch (error) {
        throw new Error(`Error agregando producto: ${error.message}`);
    }
};

const modificarProducto = async (productoproveedorid, data, usuarioid) => {
    try {
        const producto = await db.productoproveedor.findOne({ where: { productoproveedorid, usuarioid } });
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return await producto.update(data);
    } catch (error) {
        throw new Error(`Error modificando producto: ${error.message}`);
    }
};

const eliminarProducto = async (productoproveedorid, usuarioid) => {
    try {
        const producto = await db.productoproveedor.findOne({ where: { productoproveedorid, usuarioid } });
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return await producto.destroy();
    } catch (error) {
        throw new Error(`Error eliminando producto: ${error.message}`);
    }
};

const obtenerCategorias = async () => {
    try {
        return await db.categoria.findAll();
    } catch (error) {
        throw new Error(`Error obteniendo categorías: ${error.message}`);
    }
};

module.exports = {
    obtenerProductos,
    agregarProducto,
    modificarProducto,
    eliminarProducto,
    obtenerCategorias
};
