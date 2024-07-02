module.exports = (sequelize, DataTypes) => {
    const Empresa = sequelize.define('empresa', {
        ruc: {
            type: DataTypes.STRING(13),
            primaryKey: true
        },
        nombreempresa: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        direccionempresa: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        estadoruc: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        estadoempresa: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuario',
                key: 'usuarioid'
            }
        }
    }, {
        tableName: 'empresa',
        timestamps: false,
        hooks: {
            beforeCreate: (empresa, options) => {
                console.log(`Creando empresa: ${empresa.nombreempresa}`);
            },
            beforeUpdate: (empresa, options) => {
                console.log(`Actualizando empresa: ${empresa.nombreempresa}`);
            }
        }
    });

    Empresa.associate = (models) => {
        Empresa.belongsTo(models.usuario, { foreignKey: 'usuarioid', as: 'usuario' });
    };

    return Empresa;
};
