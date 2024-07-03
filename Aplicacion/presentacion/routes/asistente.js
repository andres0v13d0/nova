const express = require('express');
const router = express.Router();
const { startChatSession, sendMessage } = require('../../logica/services/asistenteService');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const chatSession = {};
    const response = await sendMessage(chatSession, message);
    res.send(response);
  } catch (error) {
    console.error('Error in /chat route:', error);
    res.status(500).send('Error ejecutando el script');
  }
});

module.exports = router;
