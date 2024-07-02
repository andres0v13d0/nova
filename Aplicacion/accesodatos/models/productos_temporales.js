module.exports = (sequelize, DataTypes) => {
    const ProductoTemporal = sequelize.define('productos_temporales', {
        productotemporalid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombreproducto: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcionproducto: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        precioproducto: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoriaid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categoria',
                key: 'categoriaid'
            }
        },
        imagen: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            get() {
                const data = this.getDataValue('imagen');
                return data ? data.toString('base64') : null;
            },
            set(value) {
                this.setDataValue('imagen', Buffer.from(value, 'base64'));
            }
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'usuarioid'
            }
        }
    }, {
        tableName: 'productos_temporales',
        timestamps: false
    });

    return ProductoTemporal;
};
