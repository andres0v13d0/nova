const db = require('../../accesodatos');

const obtenerCategorias = async () => {
  try {
    return await db.categoria.findAll();
  } catch (error) {
    throw new Error(`Error obteniendo categorías: ${error.message}`);
  }
};

const filtrarProductos = async (nombre, categoria, precioMin, precioMax) => {
  try {
    const whereClause = {};
    if (nombre) {
      whereClause.nombre = { [db.Sequelize.Op.iLike]: `%${nombre}%` };
    }
    if (categoria) {
      whereClause.categoriaid = categoria;
    }
    if (precioMin) {
      whereClause.precio = { [db.Sequelize.Op.gte]: precioMin };
    }
    if (precioMax) {
      whereClause.precio = { 
        ...whereClause.precio,
        [db.Sequelize.Op.lte]: precioMax 
      };
    }
    return await db.producto.findAll({ where: whereClause });
  } catch (error) {
    throw new Error(`Error filtrando productos: ${error.message}`);
  }
};

const obtenerProductoPorId = async (productoid) => {
  try {
    const producto = await db.producto.findByPk(productoid);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  } catch (error) {
    throw new Error(`Error obteniendo producto: ${error.message}`);
  }
};

module.exports = {
  obtenerCategorias,
  filtrarProductos,
  obtenerProductoPorId,
};
