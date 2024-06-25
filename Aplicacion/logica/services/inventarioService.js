const db = require('../../accesodatos');

const obtenerProductos = async () => {
  try {
    return await db.producto.findAll();
  } catch (error) {
    throw new Error(`Error obteniendo productos: ${error.message}`);
  }
};

const agregarProducto = async (data) => {
  try {
    return await db.producto.create(data);
  } catch (error) {
    throw new Error(`Error agregando producto: ${error.message}`);
  }
};

const modificarProducto = async (productoid, data) => {
  try {
    const producto = await db.producto.findByPk(productoid);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return await producto.update(data);
  } catch (error) {
    throw new Error(`Error modificando producto: ${error.message}`);
  }
};

const eliminarProducto = async (productoid) => {
  try {
    const producto = await db.producto.findByPk(productoid);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return await producto.destroy();
  } catch (error) {
    throw new Error(`Error eliminando producto: ${error.message}`);
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  modificarProducto,
  eliminarProducto,
};
