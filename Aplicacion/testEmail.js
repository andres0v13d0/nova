const enviarCorreo = require('./logica/services/emailService');

async function main() {
  try {
    const result = await enviarCorreo('oviedojonathan2001@gmail.com', 'Prueba de Correo', 'Este es un correo de prueba utilizando EmailJS.');
    console.log('Correo enviado:', result);
  } catch (error) {
    console.error('Error enviando el correo:', error);
  }
}

main();
