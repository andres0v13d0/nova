const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');
const { OAuth2 } = google.auth;
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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

const uploadFile = async (fileName, filePath, mimeType) => {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const listFiles = async (auth) => {
  const drive = google.drive({ version: 'v3', auth });
  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    });
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  } catch (error) {
    console.error('Error listing files:', error);
  }
};

module.exports = {
  authenticate,
  uploadFile,
  listFiles,
  oAuth2Client,  
};
