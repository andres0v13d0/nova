const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1043649098181-33fn1vi14vi7qhu8di1pjhknmenc7grq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const REFRESH_TOKEN = '1//05qWOG1pygu_WCgYIARAAGAUSNwF-L9Ir20jyFb4GgyfNyhj9vW0L0q3AqB4yhMSspkTko8lsa0bJlReq1DM2FCl_fc-CJIB7Pn8';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function enviarCorreo(destinatario, asunto, texto) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'novaapp12345@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'tu_correo@gmail.com',
      to: destinatario,
      subject: asunto,
      text: texto,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw error;
  }
}

module.exports = enviarCorreo;
