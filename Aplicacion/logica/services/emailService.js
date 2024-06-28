const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');
const nodemailer = require('nodemailer');
const { OAuth2 } = google.auth;

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

const authenticate = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        getAccessToken(oAuth2Client).then(resolve).catch(reject);
      } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
      }
    });
  });
};

const getAccessToken = (oAuth2Client) => {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error retrieving access token', err);
          reject(err);
        } else {
          oAuth2Client.setCredentials(token);
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log('Token stored to', TOKEN_PATH);
              resolve(oAuth2Client);
            }
          });
        }
      });
    });
  });
};

const enviarCorreo = async (destinatario, asunto, texto) => {
  try {
    const auth = await authenticate();
    const accessToken = await auth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'novaapp12345@gmail.com',
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: oAuth2Client.credentials.refresh_token,
        accessToken: accessToken.token,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 50000,  // 10 seconds
      greetingTimeout: 50000,    // 10 seconds
      socketTimeout: 50000       // 10 seconds
    });

    const mailOptions = {
      from: 'novaapp12345@gmail.com',
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
};

module.exports = enviarCorreo;
