const emailjs = require('emailjs-com');

const PUBLIC_KEY = 'FUVVR8Kt6eHj9xbO2'; // Tu Public Key de EmailJS
const SERVICE_ID = 'novagmailservice'; // Tu Service ID de EmailJS
const TEMPLATE_ID = 'template_v4b2d3i'; // Tu Template ID de EmailJS

emailjs.init(PUBLIC_KEY);

async function enviarCorreo(destinatario, asunto, texto) {
  const templateParams = {
    to_email: destinatario,
    subject: asunto,
    message: texto,
  };

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('Correo enviado:', result);
    return result;
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw error;
  }
}

module.exports = enviarCorreo;
