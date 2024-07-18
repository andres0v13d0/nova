const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('../../tokenFacturacion');

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function enviarCorreo(destinatario, asunto, texto, xmlAdjunto) {
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
            from: 'novaapp12345@gmail.com',
            to: destinatario,
            subject: asunto,
            text: texto,
            attachments: [
                {
                    filename: 'factura.xml',
                    content: xmlAdjunto,
                }
            ]
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error enviando el correo:', error);
        throw error;
    }
}

module.exports = enviarCorreo;
