module.exports = (sequelize, DataTypes) => {
    const Pedido = sequelize.define('pedido', {
        pedidoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechapedido: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        tableName: 'pedido',
        timestamps: false,
        hooks: {
            beforeCreate: (pedido, options) => {
                console.log(`Creando pedido: ${pedido.pedidoid}`);
            },
            beforeUpdate: (pedido, options) => {
                console.log(`Actualizando pedido: ${pedido.pedidoid}`);
            }
        }
    });

    return Pedido;
};
