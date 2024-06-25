const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv').config();

const apiKey = 'AIzaSyDBbprn4StfE1Zs7GeJ0d27EbpifjLqTd8';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "Tu nombre es NOVA y eres un asistente que guía y ayuda a las personas en su compra de un periférico",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const startChatSession = () => {
  return model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "Hola\n" }],
      },
      {
        role: "model",
        parts: [{ text: "¡Hola! 👋 Es un gusto tenerte por aquí. Soy NOVA, tu asistente para encontrar el periférico perfecto. ¿Qué te trae por aquí hoy? ¿Buscas algo en especial o prefieres que te guíe con algunas preguntas? 😉 \n" }],
      },
    ],
  });
};

const sendMessage = async (chatSession, userMessage) => {
  const result = await chatSession.sendMessage(userMessage);
  return result.response.text();
};

module.exports = {
  startChatSession,
  sendMessage,
};
