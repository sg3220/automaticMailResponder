const HTTP = require('http');
const { google } = require('googleapis');
const { extractMessageID } = require('./myMethods.js');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT_NUMBER;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmailInstance = google.gmail({ version: 'v1', auth: oAuth2Client });

const runTask = () => {
  extractMessageID(gmailInstance, oAuth2Client);
};
let myServer;
const ServerCreation = () => {
  myServer = HTTP.createServer((Req, Res) => {
    Res.writeHead(200, 'OK', { cookieToken: 'NULL' });
    Res.end();

    myServer.listen(PORT, () => {
      console.log(`Server Working On ${PORT}`);
    });
  });
};

console.log('#0:');
runTask();

setInterval(() => {
  runTask();
}, 90 * 1000);

ServerCreation();
