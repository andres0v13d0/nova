const db = require('../../accesodatos');

const crearPedido = async (usuarioid, carrito) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.pedido.create({
            usuarioid: usuarioid,
            fechapedido: new Date(),
            estado: 'pendiente',
            total: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
        }, { transaction });

        for (const item of carrito) {
            await db.pedidoproducto.create({
                pedidoid: pedido.pedidoid,
                productoid: item.productoid,
                cantidad: item.cantidad,
                precio: item.precio
            }, { transaction });
        }

        await transaction.commit();
        return pedido;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error creando el pedido: ${error.message}`);
    }
};

const registrarVenta = async (pedidoId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const pedido = await db.pedido.findByPk(pedidoId, { transaction });

        pedido.estado = 'completado';
        await pedido.save({ transaction });

        const pedidoProductos = await db.pedidoproducto.findAll({ where: { pedidoid: pedidoId }, transaction });
        for (const pedidoProducto of pedidoProductos) {
            const producto = await db.producto.findByPk(pedidoProducto.productoid, { transaction });
            producto.cantidadstock -= pedidoProducto.cantidad;
            await producto.save({ transaction });
        }

        await db.pago.create({
            pedidoid: pedidoId,
            precio: pedido.total,
            fechapago: new Date()
        }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error registrando la venta: ${error.message}`);
    }
};

module.exports = {
    crearPedido,
    registrarVenta,
};
