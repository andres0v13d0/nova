module.exports = (sequelize, DataTypes) => {
    const InventarioProveedor = sequelize.define('inventarioproveedor', {
        inventarioproveedorid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productoid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        proveedorid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidadsuministrada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precioentrega: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        fechasuministro: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'inventarioproveedor',
        timestamps: false,
        hooks: {
            beforeCreate: (inventario, options) => {
                console.log(`Agregando producto: ${inventario.productoid} a inventario del proveedor: ${inventario.proveedorid}`);
            },
            beforeUpdate: (inventario, options) => {
                console.log(`Actualizando inventario del proveedor: ${inventario.proveedorid}`);
            }
        }
    });

    return InventarioProveedor;
};
