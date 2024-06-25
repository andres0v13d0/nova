const express = require('express');
const router = express.Router();
const asistenteService = require('../../logica/services/asistenteService');

router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.userInput;
    const chatSession = asistenteService.startChatSession();
    const response = await asistenteService.sendMessage(chatSession, userMessage);
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error ejecutando el script');
  }
});

module.exports = router;
