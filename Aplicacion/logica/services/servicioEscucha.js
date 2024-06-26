const { Client } = require('pg');
const { google } = require('googleapis');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const FILE_NAME = 'productos.csv';
const FILE_PATH = path.join(__dirname, FILE_NAME);
const FILE_ID = '1De9nlotwwAnIrdi62ToJq2AkTpDggXoE';

const client = new Client({
  user: dbConfig.username,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port || 5432,
});

client.connect();

client.query('LISTEN producto_changes');

client.on('notification', async (msg) => {
  console.log('Producto change detected:', msg.payload);
  await actualizarArchivoCSV();
});

const authenticate = async () => {
  const TOKEN_PATH = path.join(__dirname, 'token.json');
  const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const token = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));

  return oAuth2Client;
};

const uploadFile = async (auth, fileName, filePath, mimeType, fileId) => {
  const drive = google.drive({ version: 'v3', auth });
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    await drive.files.update({
      fileId: fileId,
      media: media,
    });
    console.log('Archivo actualizado en Google Drive');
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
  }
};

const actualizarArchivoCSV = async () => {
  try {
    const productos = await client.query('SELECT * FROM producto');
    const csv = parse(productos.rows);

    fs.writeFileSync(FILE_PATH, csv);
    console.log(`Archivo ${FILE_NAME} actualizado localmente`);

    const auth = await authenticate();
    await uploadFile(auth, FILE_NAME, FILE_PATH, 'text/csv', FILE_ID);
  } catch (error) {
    console.error('Error al actualizar el archivo CSV:', error);
  }
};

console.log('Escuchando cambios en la tabla producto...');
