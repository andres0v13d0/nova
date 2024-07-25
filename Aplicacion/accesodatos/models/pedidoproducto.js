module.exports = (sequelize, DataTypes) => {
    const PedidoProducto = sequelize.define('pedidoproducto', {
        pedidoproductoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pedidoid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productoid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL,
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

    PedidoProducto.associate = models => {
        PedidoProducto.belongsTo(models.producto, {
            foreignKey: 'productoid',
            as: 'producto'
        });
        PedidoProducto.belongsTo(models.pedido, {
            foreignKey: 'pedidoid',
            as: 'pedido'
        });
    };

    return PedidoProducto;
};
