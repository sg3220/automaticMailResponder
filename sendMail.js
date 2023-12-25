const nodemailer = require('nodemailer');

//--> Using Dotenv To Keep Credentials Confidential
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const SendMail = async (senderDetails, oAuth2Client) => {
  return new Promise(async (Res, Rej) => {
    try {
      const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
      //--> Configuring Transporter
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'Oauth2',
          user: 's8418g@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
        },
      });
      //--> Configuring mailOptions
      const mailOptions = {
        from: 'Ghosh Bot <s8418g@gmail.com>',
        to: `${senderDetails.senderEmail}`,
        subject: `${senderDetails.mailSubject}`,
        text: `${senderDetails.mailText}`,
        html: `<h1>${senderDetails.mailText}<h1>`,
      };
      //--> Sending Mail
      const finalResult = await transport.sendMail(mailOptions);
      Res({ status: 'Success' });
    } catch (myError) {
      Rej({ status: 'Fail', functionName: 'sendMail()' });
    }
  });
};

module.exports = {
  SendMail,
};
