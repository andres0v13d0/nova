const db = require('../../accesodatos');

const listarProveedores = async () => {
    try {
        return await db.proveedor.findAll();
    } catch (error) {
        throw new Error(`Error listando proveedores: ${error.message}`);
    }
};

const agregarProveedor = async (proveedorData) => {
    try {
        return await db.proveedor.create(proveedorData);
    } catch (error) {
        throw new Error(`Error agregando proveedor: ${error.message}`);
    }
};

const modificarProveedor = async (id, proveedorData) => {
    try {
        const proveedor = await db.proveedor.findByPk(id);
        if (proveedor) {
            return await proveedor.update(proveedorData);
        } else {
            throw new Error('Proveedor no encontrado');
        }
    } catch (error) {
        throw new Error(`Error modificando proveedor: ${error.message}`);
    }
};

const eliminarProveedor = async (id) => {
    try {
        const proveedor = await db.proveedor.findByPk(id);
        if (proveedor) {
            await proveedor.destroy();
        } else {
            throw new Error('Proveedor no encontrado');
        }
    } catch (error) {
        throw new Error(`Error eliminando proveedor: ${error.message}`);
    }
};

module.exports = {
    listarProveedores,
    agregarProveedor,
    modificarProveedor,
    eliminarProveedor,
};
