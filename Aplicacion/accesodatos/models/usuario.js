module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
        usuarioid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        correoelectronico: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        rol: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: false,
        hooks: {
            beforeCreate: (user, options) => {
                console.log(`Creando usuario: ${user.nombre}`);
            },
            beforeUpdate: (user, options) => {
                console.log(`Actualizando usuario: ${user.nombre}`);
            }
        }
    });

    return Usuario;
};
