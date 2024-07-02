module.exports = (sequelize, DataTypes) => {
    const ProductoProveedor = sequelize.define('productoproveedor', {
        productoproveedorid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombreproducto: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcionproducto: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        precioproducto: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        categoriaid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagenproducto: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            get() {
                const data = this.getDataValue('imagenproducto');
                return data ? data.toString('base64') : null;
            },
            set(value) {
                this.setDataValue('imagenproducto', Buffer.from(value, 'base64'));
            }
        }
    }, {
        tableName: 'productoproveedor',
        timestamps: false,
        hooks: {
            beforeCreate: (producto, options) => {
                console.log(`Agregando producto nuevo: ${producto.nombreproducto}`);
            },
            beforeUpdate: (producto, options) => {
                console.log(`El proveedor que agrega es: ${producto.usuarioid}`);
            }
        }
    });

    ProductoProveedor.associate = (models) => {
        ProductoProveedor.belongsTo(models.categoria, { foreignKey: 'categoriaid', as: 'categoria' });
        ProductoProveedor.belongsTo(models.usuario, { foreignKey: 'usuarioid', as: 'proveedor' });
    };

    return ProductoProveedor;
};
