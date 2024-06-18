const db = require('../../accesodatos');

const registrarFeedback = async (feedbackData) => {
    try {
        const feedback = await db.feedback.create(feedbackData);
        return feedback;
    } catch (error) {
        throw new Error(`Error registrando feedback: ${error.message}`);
    }
};

module.exports = {
    registrarFeedback,
};
