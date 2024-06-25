const express = require('express');
const router = express.Router();
const feedbackService = require('../../logica/services/feedbackService');

router.post('/registrar', async (req, res) => {
    try {
        const feedback = await feedbackService.registrarFeedback(req.body);
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
