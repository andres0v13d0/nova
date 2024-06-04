module.exports = (sequelize, DataTypes) => {
    const PedidoProducto = sequelize.define('pedidoproducto', {
        pedidoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        productoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'pedidoproducto',
        timestamps: false,
        hooks: {
            beforeCreate: (pedidoProducto, options) => {
                console.log(`Agregando producto: ${pedidoProducto.productoid} a pedido: ${pedidoProducto.pedidoid}`);
            },
            beforeUpdate: (pedidoProducto, options) => {
                console.log(`Actualizando producto: ${pedidoProducto.productoid} en pedido: ${pedidoProducto.pedidoid}`);
            }
        }
    });

    return PedidoProducto;
};
