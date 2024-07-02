const express = require('express');
const router = express.Router();
const { startChatSession, sendMessage } = require('../../logica/services/asistenteService');

router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.userInput;
    const chatSession = await startChatSession();
    const response = await sendMessage(chatSession, userMessage);
    res.json({ response });
  } catch (error) {
    console.error('Error in /chat route:', error);
    res.status(500).send('Error ejecutando el script');
  }
});

module.exports = router;
