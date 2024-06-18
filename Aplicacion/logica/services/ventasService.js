const db = require('../../accesodatos');

const registrarVenta = async (ventaData) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.Pedido.create(ventaData.pedido, { transaction });
        const detalles = await Promise.all(ventaData.productos.map(async (producto) => {
            const pedidoProducto = await db.PedidoProducto.create({
                PedidoID: pedido.PedidoID,
                ProductoID: producto.ProductoID,
                Cantidad: producto.Cantidad,
                Precio: producto.Precio,
            }, { transaction });

            const productoActualizado = await db.Producto.findByPk(producto.ProductoID, { transaction });
            productoActualizado.CantidadStock -= producto.Cantidad;
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
