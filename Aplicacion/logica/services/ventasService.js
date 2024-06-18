const db = require('../../accesodatos');

const registrarVenta = async (ventaData) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.pedido.create(ventaData.pedido, { transaction });
        const detalles = await Promise.all(ventaData.productos.map(async (producto) => {
            const pedidoProducto = await db.pedidoproducto.create({
                pedidoid: pedido.pedidoid,
                productoid: producto.productoid,
                cantidad: producto.cantidad,
                precio: producto.precio,
            }, { transaction });

            const productoActualizado = await db.producto.findByPk(producto.productoid, { transaction });
            productoActualizado.cantidadstock -= producto.cantidad;
            await productoActualizado.save({ transaction });

            return pedidoProducto;
        }));

        await transaction.commit();
        return { pedido, detalles };
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error registrando la venta: ${error.message}`);
    }
};

module.exports = {
    registrarVenta,
};
