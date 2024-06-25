const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');
const { OAuth2 } = google.auth;
const TOKEN_PATH = path.join(__dirname, 'token.json');

const CLIENT_ID = '1043649098181-33fn1vi14vi7qhu8di1pjhknmenc7grq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const REFRESH_TOKEN = '1//05qWOG1pygu_WCgYIARAAGAUSNwF-L9Ir20jyFb4GgyfNyhj9vW0L0q3AqB4yhMSspkTko8lsa0bJlReq1DM2FCl_fc-CJIB7Pn8';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authenticate = () => {
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
};

const getAccessToken = (oAuth2Client) => {
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
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
};

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const uploadFile = async (fileName, filePath, mimeType) => {
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType,
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

const main = async () => {
  authenticate();
  const fileName = 'productos.csv';
  const filePath = path.join(__dirname, fileName);
  const mimeType = 'text/csv';
  const fileId = await uploadFile(fileName, filePath, mimeType);
  console.log('Uploaded file ID:', fileId);
};

main();
