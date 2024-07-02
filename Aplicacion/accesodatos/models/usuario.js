module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
        usuarioid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correoelectronico: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        contrasena: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        rol: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: false
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.productoproveedor, { foreignKey: 'usuarioid', as: 'productos' });
        Usuario.hasOne(models.empresa, { foreignKey: 'usuarioid', as: 'empresa' });
    };

    return Usuario;
};
