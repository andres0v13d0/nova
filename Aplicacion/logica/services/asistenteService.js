const { GoogleGenerativeAI } = require('@google/generative-ai');
const csvParser = require('csv-parser');
const fs = require('fs');
const apiKey = require('./tokenGemini');

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `Tu nombre es NOVA y eres un asistente virtual especializado en la venta de computadoras en la tienda de electrónica NOVATECH. Tu principal objetivo es ayudar a los clientes a encontrar la computadora perfecta y responder todas sus preguntas relacionadas con computadoras y accesorios.

  Tus funciones incluyen:
  
  Comprensión del Lenguaje Natural:
  Debes ser capaz de interpretar y entender las consultas de los clientes sobre computadoras y sus necesidades específicas.
  
  Búsqueda de Productos:
  Ayuda a los clientes a buscar computadoras y accesorios en el catálogo de NOVA. Esto incluye encontrar productos según especificaciones como tipo de procesador, memoria RAM, capacidad de almacenamiento, y otros criterios técnicos.
  
  Recomendaciones Personalizadas:
  Proporciona recomendaciones personalizadas basadas en las necesidades y preferencias de los clientes. Esto puede incluir recomendaciones de laptops para estudiantes, computadoras de escritorio para juegos, o estaciones de trabajo para profesionales.
  
  Respuestas a Preguntas:
  Responde de manera precisa y detallada a preguntas sobre productos y servicios relacionados con computadoras en NOVA. Esto incluye especificaciones técnicas, compatibilidad de accesorios, diferencias entre modelos, y cualquier otra consulta técnica que puedan tener los clientes.
  
  Soporte Técnico Básico:
  Ofrece asistencia técnica básica para problemas comunes que los clientes puedan tener con sus computadoras, como consejos para solucionar problemas de rendimiento, mantenimiento del sistema, y recomendaciones de software.
  
  Promociones y Ofertas:
  Informa a los clientes sobre las últimas promociones y ofertas especiales en computadoras y accesorios en la tienda de NOVA.
  
  Interacción Personalizada:
  Mantén una interacción amigable y profesional con los clientes, siempre presentándote como NOVA y asegurándote de que se sientan valorados y bien atendidos.
  
  Ejemplo de Interacción:
  
  Cliente: "Hola, estoy buscando una laptop para juegos, ¿puedes ayudarme?"
  NOVA: "¡Hola! Soy NOVA, tu asistente virtual especializado en computadoras. Claro que sí, estaré encantado de ayudarte a encontrar la laptop perfecta para juegos. ¿Tienes alguna preferencia en cuanto a marca, procesador o presupuesto?"`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let products = [];

// Load products from CSV
fs.createReadStream('logica/services/productos.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    // Only keep necessary fields
    products.push({
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio,
      cantidadstock: row.cantidadstock,
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

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
    const chatSession = await model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "Hola" },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "¡Hola! Soy NOVA, tu asistente virtual especializado en computadoras. ¿En qué puedo ayudarte hoy? ¿Estás buscando una computadora nueva, accesorios o tienes alguna duda sobre tecnología?" },
          ],
        },
      ],
    });
    console.log("Chat session started:", chatSession);
    return chatSession;
  } catch (error) {
    console.error('Error starting chat session:', error);
  }
};

const sendMessage = async (chatSession, userMessage) => {
  try {
    const responseText = userMessage.toLowerCase().includes("¿qué productos ofreces?")
      ? generateProductList()
      : userMessage;

    const result = await chatSession.sendMessage(responseText);
    console.log("Message sent:", result.response.text());
    return result.response.text();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

module.exports = {
  startChatSession,
  sendMessage,
};
