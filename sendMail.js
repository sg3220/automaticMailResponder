const nodemailer = require('nodemailer');

//--> Using Dotenv To Keep Credentials Confidential
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const SendMail = async (recipient, oAuth2Client) => {
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
        from: 'Reply From 🤖 <s8418g@gmail.com>',
        to: `${recipient}`,
        subject: 'Automatic-Mail-Responder',
        text: 'A NodeJS Application To Reply To Unreplied Emails, Add Labels Automatically',
        html: '<h1>A NodeJS Application To Reply To Unreplied Emails, Add Labels Automatically<h1>',
      };
      //--> Sending Mail
      const finalResult = await transport.sendMail(mailOptions);
      console.log('messageFromServer: Email Sent✅');
      Res('Success');
    } catch (error) {
      console.error('messageFromServer: Email Sent❌');
      Rej('Fail');
    }
  });
};

module.exports = {
  SendMail,
};
