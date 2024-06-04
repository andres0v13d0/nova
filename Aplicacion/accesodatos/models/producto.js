module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('producto', {
        productoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        categoriaid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'producto',
        timestamps: false,
        hooks: {
            beforeCreate: (producto, options) => {
                console.log(`Creando producto: ${producto.nombre}`);
            },
            beforeUpdate: (producto, options) => {
                console.log(`Actualizando producto: ${producto.nombre}`);
            }
        }
    });

    return Producto;
};
