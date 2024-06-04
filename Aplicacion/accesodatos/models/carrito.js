module.exports = (sequelize, DataTypes) => {
    const Carrito = sequelize.define('carrito', {
        carritoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'carrito',
        timestamps: false,
        hooks: {
            beforeCreate: (carrito, options) => {
                console.log(`Creando carrito para usuario: ${carrito.usuarioid}`);
            },
            beforeUpdate: (carrito, options) => {
                console.log(`Actualizando carrito: ${carrito.carritoid}`);
            }
        }
    });

    return Carrito;
};
