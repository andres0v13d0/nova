module.exports = (sequelize, DataTypes) => {
    const InventarioProveedor = sequelize.define('inventarioproveedor', {
        inventarioid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        proveedorid: {
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
