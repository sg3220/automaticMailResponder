const { google } = require('googleapis');
const { extractMessageID } = require('./myMethods.js');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
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

console.log('#0:');
runTask();

setInterval(() => {
  console.log('Again: ');
  runTask();
}, 45 * 1000);
