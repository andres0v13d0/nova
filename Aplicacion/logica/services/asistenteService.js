const OpenAI = require("openai");
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const apiKey = require('./tokenGPT');

const openai = new OpenAI({
  apiKey: apiKey,
});

const model = "gpt-3.5-turbo";
const generationConfig = {
  temperature: 0.7,
  max_tokens: 100,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

let products = [];
let cache = {}; // Caché para almacenar respuestas comunes
let sessionContext = [
  {
    role: "system",
    content: `Tu nombre es NOVA y eres un asistente virtual especializado en la venta de computadoras en la tienda de electrónica NOVATECH. Tu principal objetivo es ayudar a los clientes a encontrar la computadora perfecta y responder todas sus preguntas relacionadas con computadoras y accesorios. Tus funciones incluyen: Comprensión del Lenguaje Natural, Búsqueda de Productos, Recomendaciones Personalizadas, Respuestas a Preguntas, Soporte Técnico Básico, Promociones y Ofertas, Interacción Personalizada.`,
  }
];

// Load products from CSV
const loadCSV = () => {
  return new Promise((resolve, reject) => {
    const productsTemp = [];
    fs.createReadStream(path.join(__dirname, 'productos.csv'))
      .pipe(csvParser())
      .on('data', (row) => {
        productsTemp.push({
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio,
          cantidadstock: row.cantidadstock,
        });
      })
      .on('end', () => {
        products = productsTemp;
        resolve(products);
      })
      .on('error', reject);
  });
};

const generateProductList = () => {
  if (products.length === 0) {
    return "Actualmente no tenemos productos disponibles.";
  }

  return products.map(product =>
    `**Nombre:** ${product.nombre}\n**Descripción:** ${product.descripcion}\n**Precio:** $${product.precio}\n**Cantidad en stock:** ${product.cantidadstock}\n`
  ).join('\n\n');
};

const startChatSession = async () => {
  try {
    await loadCSV();
    const response = await openai.chat.completions.create({
      model,
      messages: sessionContext,
      ...generationConfig,
    });

    console.log("API Response:", response);

    if (response && response.choices && response.choices.length > 0) {
      const botMessage = response.choices[0].message.content;
      console.log("Chat session started:", botMessage);
      return botMessage;
    } else {
      throw new Error('No valid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error starting chat session:', error.message || error);
    return 'Lo siento, estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo más tarde.';
  }
};

const sendMessage = async (userMessage) => {
  try {
    await loadCSV();

    // Check if the response is cached
    if (cache[userMessage]) {
      return cache[userMessage];
    }

    const messages = [...sessionContext, { role: "user", content: userMessage }];

    if (userMessage.toLowerCase().includes("hola")) {
      messages.push({ role: "assistant", content: "¡Hola! Soy NOVA, tu asistente virtual especializado en computadoras. ¿En qué puedo ayudarte hoy? ¿Estás buscando una computadora nueva, accesorios o tienes alguna duda sobre tecnología?" });
    } else if (userMessage.toLowerCase().includes("productos") || userMessage.toLowerCase().includes("catálogo") || userMessage.toLowerCase().includes("¿qué productos ofreces?")) {
      messages.push({ role: "assistant", content: "Claro, actualmente tengo los siguientes productos:\n" + generateProductList() });
    } else if (userMessage.toLowerCase().includes("recomiéndame una computadora") || userMessage.toLowerCase().includes("recomendación de computadora")) {
      messages.push({ role: "assistant", content: "Para recomendarte una computadora, necesito saber más sobre tus necesidades. ¿Para qué tipo de tareas la usarás principalmente?" });
    } else {
      messages.push({ role: "assistant", content: "¡Hola! Soy Nova, tu asistente virtual de NOVATECH. ¿En qué puedo ayudarte hoy? ¿Estás buscando alguna computadora en particular o tienes alguna pregunta sobre nuestros productos?" });
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      ...generationConfig,
    });

    console.log("API Response:", response);

    if (response && response.choices && response.choices.length > 0) {
      const botResponse = response.choices[0].message.content;
      cache[userMessage] = botResponse; // Cache the response

      console.log("Message sent:", botResponse);
      return botResponse;
    } else {
      throw new Error('No valid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error sending message:', error.message || error);
    return 'Lo siento, estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo más tarde.';
  }
};

module.exports = {
  startChatSession,
  sendMessage,
};
