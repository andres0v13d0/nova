module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('categoria', {
        categoriaid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'categoria',
        timestamps: false
    });

    Categoria.associate = (models) => {
        Categoria.hasMany(models.productoproveedor, { foreignKey: 'categoriaid', as: 'productos' });
    };

    return Categoria;
};
