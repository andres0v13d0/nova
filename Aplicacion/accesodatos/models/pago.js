module.exports = (sequelize, DataTypes) => {
    const Pago = sequelize.define('pago', {
        pagoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pedidoid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        fechapago: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'pago',
        timestamps: false,
        hooks: {
            beforeCreate: (pago, options) => {
                console.log(`Creando pago: ${pago.pagoid}`);
            },
            beforeUpdate: (pago, options) => {
                console.log(`Actualizando pago: ${pago.pagoid}`);
            }
        }
    });

    return Pago;
};
