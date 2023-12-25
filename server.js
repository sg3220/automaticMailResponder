const HTTP = require('http');
const { google } = require('googleapis');
const { extractAndMessage } = require('./myMethods.js');
const { SendMail } = require('./sendMail.js');

//--> Using Dotenv To Keep Credentials Confidential
require('dotenv').config();

//--> Introducing Environment Variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT_NUMBER;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

//--> Creating All The Necessary Instances & Clients
const mainApp = (Req, Res) => {
  //--> Creating newInstance Of OAuth2 Class
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  //--> Creating GMail API Client
  const gmailInstance = google.gmail({ version: 'v1', auth: oAuth2Client });

  // console.log(gmailInstance);

  runTask(gmailInstance, oAuth2Client);
};

//--> Function To Generate A Time Interval Between 45s & 120s.
const generateRandomInterval = () => {
  const randomDecimal = Math.random();
  const randomInterval = randomDecimal * 75 + 45;
  console.log(`❕Next Check In... ${Math.floor(randomInterval)}s`);
  return randomInterval * 1000;
};

const runTask = async (gmailInstance, oAuth2Client) => {
  try {
    const finalResult = await extractAndMessage(gmailInstance, oAuth2Client);
    if (
      finalResult['status'] === 'All Mail Responded✅' ||
      finalResult['status'] === 'No New Mail✅'
    ) {
      console.log(finalResult['status']);
      setTimeout(() => {
        runTask(gmailInstance, oAuth2Client);
      }, generateRandomInterval());
    }
  } catch (myError) {
    console.error(`❗Error, In Function: ${myError.functionName}`);
    const senderDetails = {
      senderEmail: 'siddharthghosh3220@gmail.com',
      mailSubject: '❗ Error',
      mailText: 'Alert: Automatic-Mail-Responder-Service Crashed',
    };
    await SendMail(senderDetails, oAuth2Client);
    console.log('messageFromServer: Error Reported✅');
    myServer.close();
  }
};

//--> Creating HTTP Server
const myServer = HTTP.createServer((Req, Res) => {
  Res.writeHead(200, 'Working', { cookieToken: 'notRequired' });
  Res.write(JSON.stringify('Automatic-Mail-Responder Server Working'));
  Res.end();
}).listen(PORT, (Req, Res) => {
  console.log(`Server Working On ${PORT}`);
  mainApp();
});
