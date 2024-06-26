const { authenticate, uploadFile, listFiles, oAuth2Client } = require('./logica/services/googleDriveService');
const path = require('path');
const express = require('express');
const fs = require('fs');

const TOKEN_PATH = path.join(__dirname, 'token.json'); // Asegúrate de definir TOKEN_PATH

const app = express();
const PORT = 3000;

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send('Error: Missing authorization code');
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authorization successful! You can close this tab.');
    // Subir el archivo después de la autenticación exitosa
    await uploadFileAfterAuth();
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error retrieving access token');
  }
});

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file'],
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Authorize this app by visiting this url: ${authUrl}`);
});

const uploadFileAfterAuth = async () => {
  try {
    const fileName = 'productos.csv';
    const filePath = path.join(__dirname, fileName);
    const mimeType = 'text/csv';
    const fileId = await uploadFile(fileName, filePath, mimeType);
    console.log('Uploaded file ID:', fileId);
    await listFiles(oAuth2Client);  // Listar archivos para verificar la subida
  } catch (error) {
    console.error('Error during the process:', error);
  }
};

const main = async () => {
  try {
    const authClient = await authenticate();
    await uploadFileAfterAuth();
  } catch (error) {
    console.error('Error during the process:', error);
  }
};

main();
