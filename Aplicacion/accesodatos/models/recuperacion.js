module.exports = (sequelize, DataTypes) => {
    const recuperacion = sequelize.define('recuperacion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        correoelectronico: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        codigorecuperacion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        
    });

    return recuperacion;
};
