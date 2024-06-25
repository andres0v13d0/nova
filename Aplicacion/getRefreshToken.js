const { google } = require('googleapis');
const express = require('express');

const CLIENT_ID = '1043649098181-33fn1vi14vi7qhu8di1pjhknmenc7grq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const app = express();

const SCOPES = ['https://mail.google.com/'];

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send('Error: Missing authorization code');
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authorization successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error retrieving access token');
  }
});

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

app.listen(3000, async () => {
  console.log(`Server is running on http://localhost:3000`);
  console.log(`Authorize this app by visiting this url: ${authUrl}`);

  const open = await import('open');
  open.default(authUrl); // Abre automáticamente el navegador para la autenticación
});
