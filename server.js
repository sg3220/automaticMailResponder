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
  console.log(`Checking For New Mails...`);
  extractMessageID(gmailInstance, oAuth2Client);
};

const randomInterval = () => {
  const randomDecimal = Math.random();
  const randomInterval = 45 + randomDecimal * 75;
  console.log(`Next Check For UNREAD Mails In... ${randomInterval}s`);
  return randomInterval * 1000;
};

const mainApp = () => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const gmailInstance = google.gmail({ version: 'v1', auth: oAuth2Client });
  console.log(`intialCheck: `);
  runTask(gmailInstance, oAuth2Client);

  setInterval(() => {
    runTask(gmailInstance, oAuth2Client);
  }, randomInterval());
};

const myServer = HTTP.createServer((Req, Res) => {
  Res.writeHead(200, 'OK', { cookieToken: 'NULL' });
  Res.write('Automatic-Node-Mailer Server');
  Res.end();
}).listen(PORT, () => {
  console.log(`Server Working On ${PORT}`);
  mainApp();
});
