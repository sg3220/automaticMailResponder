const HTTP = require('http');
const { google } = require('googleapis');
const { extractAndMessage } = require('./myMethods.js');

//--> Using Dotenv To Keep Credentials Confidential
require('dotenv').config();

//--> Introducing Environment Variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT_NUMBER;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const runTask = async (gmailInstance, oAuth2Client) => {
  console.log(`Initiating...`);
  const result = await extractAndMessage(gmailInstance, oAuth2Client);
  if (result === 1) {
    setTimeout(() => {
      runTask(gmailInstance, oAuth2Client);
    }, randomIntervalFun() * 1000);
  } else {
    console.error(`Closing Server Due To Error`);
    myServer.close();
  }
};

//--> Function To Generate Time Interval Between 45s & 120s.
const randomIntervalFun = () => {
  const randomDecimal = Math.random();
  const randomInterval = 45 + randomDecimal * 75;
  console.log(`messageFromServer: Next Check In... ${randomInterval}s`);
  return randomInterval;
};

const mainApp = () => {
  //--> Creating newInstance Of OAuth2 Class
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  //--> Creating GMail API Client
  const gmailInstance = google.gmail({ version: 'v1', auth: oAuth2Client });

  runTask(gmailInstance, oAuth2Client);
};

//--> Creating HTTP Server
const myServer = HTTP.createServer((Req, Res) => {
  Res.writeHead(200, 'OK', { cookieToken: 'internship' });
  Res.write('Automatic-Node-Mailer Server');
  Res.end();
}).listen(PORT, () => {
  console.log(`Server Working On ${PORT}`);
  mainApp();
});
