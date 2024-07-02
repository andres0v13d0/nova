module.exports = (sequelize, DataTypes) => {
    const Tablatememp = sequelize.define('tablatememp', {
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
        correoelectronico:{
            type: DataTypes.STRING(100),
            allowNull: false
        }
    });

    return Tablatememp;
};
