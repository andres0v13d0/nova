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
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        cantidadstock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoriaid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mostrarp: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        }
    }, {
        tableName: 'producto',
        timestamps: false
    });

    return Producto;
};
