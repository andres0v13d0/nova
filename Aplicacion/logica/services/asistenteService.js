const OpenAI = require('openai');
const db = require('../../accesodatos');
const OPENAI_API_KEY = require('./tokenGPT');
const { Op } = require('sequelize');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function startChatSession() {
  return {};
}

const sendMessage  = async (chatSession, userMessage) => {
  if (typeof userMessage !== 'string' || userMessage.trim() === '') {
    throw new Error('El mensaje del usuario es inválido.');
  }
  
  let productosEncontrados = await buscarProductosEnInventario();
  let productosLista = productosEncontrados.map(producto => {
    return `- ${producto.nombre}: ${producto.descripcion}, Precio: ${producto.precio}, Stock: ${producto.cantidadstock}`;
  }).join('\n');

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un asistente de tienda en línea que ofrece recomendaciones de productos. Responde de forma útil y adecuada a las preguntas sobre los productos disponibles, si te hacen una pregunta sobre otro tema que no sea sobre los productos o sobre la tienda dile al usuario que no puedes responder eso porque es de otro contexto.
          Ofreces estos productos: \n${productosLista}`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 150,
    });
  } catch (error) {
    console.error('Error al llamar a la API de OpenAI:', error);
    throw new Error('Error al generar la respuesta del asistente.');
  }

  console.log('Respuesta cruda de la API de OpenAI:', response);

  if (response && response.choices && response.choices.length > 0) {
    const respuestaBot = response.choices[0].message.content;
    console.log("Chat session started:", respuestaBot);
    return respuestaBot;
  } else {
    throw new Error('No valid response from OpenAI API');
  }
};

async function buscarProductosEnInventario() {
  const productos = await db.producto.findAll({
    attributes: ['nombre', 'descripcion', 'precio', 'cantidadstock'],
  });

  return productos.map(producto => producto.dataValues);
}

module.exports = {
  startChatSession,
  sendMessage,
};
