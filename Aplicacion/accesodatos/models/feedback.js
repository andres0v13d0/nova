module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('feedback', {
        feedbackid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuarioid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comentario: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        calificacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'feedback',
        timestamps: false,
        hooks: {
            beforeCreate: (feedback, options) => {
                console.log(`Creando feedback: ${feedback.feedbackid}`);
            },
            beforeUpdate: (feedback, options) => {
                console.log(`Actualizando feedback: ${feedback.feedbackid}`);
            }
        }
    });

    return Feedback;
};
