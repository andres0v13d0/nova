module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('categoria', {
        categoriaid: {
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
        }
    }, {
        tableName: 'categoria',
        timestamps: false,
        hooks: {
            beforeCreate: (categoria, options) => {
                console.log(`Creando categoria: ${categoria.nombre}`);
            },
            beforeUpdate: (categoria, options) => {
                console.log(`Actualizando categoria: ${categoria.nombre}`);
            }
        }
    });

    return Categoria;
};
