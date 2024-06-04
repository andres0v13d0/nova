module.exports = (sequelize, DataTypes) => {
    const Proveedor = sequelize.define('proveedor', {
        proveedorid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        contacto: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(15),
            allowNull: true
        }
    }, {
        tableName: 'proveedor',
        timestamps: false,
        hooks: {
            beforeCreate: (proveedor, options) => {
                console.log(`Creando proveedor: ${proveedor.nombre}`);
            },
            beforeUpdate: (proveedor, options) => {
                console.log(`Actualizando proveedor: ${proveedor.nombre}`);
            }
        }
    });

    return Proveedor;
};
