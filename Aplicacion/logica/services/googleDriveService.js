const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');
const { OAuth2 } = google.auth;
const TOKEN_PATH = path.join(__dirname, 'token.json');

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

const CLIENT_ID = '1043649098181-33fn1vi14vi7qhu8di1pjhknmenc7grq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authenticate();

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const uploadFile = (fileName, filePath, mimeType, fileId) => {
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  if (fileId) {
    return drive.files.update({
      fileId,
      media: media,
    });
  } else {
    return drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
  }
};

module.exports = {
  uploadFile,
};
