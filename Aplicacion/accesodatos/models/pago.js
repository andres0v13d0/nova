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
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        metodo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        fecha: {
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
