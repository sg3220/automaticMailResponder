const HTTP = require('http');
const { google } = require('googleapis');
const { extractMessageID } = require('./myMethods.js');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT_NUMBER;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const runTask = (gmailInstance, oAuth2Client) => {
  extractMessageID(gmailInstance, oAuth2Client);
};

const MainApp = () => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const gmailInstance = google.gmail({ version: 'v1', auth: oAuth2Client });

  console.log('#0:');
  runTask(gmailInstance, oAuth2Client);

  setInterval(() => {
    runTask(gmailInstance, oAuth2Client);
  }, 105 * 1000);
};

const myServer = HTTP.createServer((Req, Res) => {
  Res.writeHead(200, 'OK', { cookieToken: 'NULL' });
  Res.write('Automatic-Node-Mailer Backend Server');
  Res.end();
}).listen(PORT, () => {
  console.log(`Server Working On ${PORT}`);
  MainApp();
});
