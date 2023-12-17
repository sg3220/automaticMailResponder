const nodemailer = require('nodemailer');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const SendMail = async (recipient, oAuth2Client) => {
  return new Promise(async (Res, Rej) => {
    try {
      const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
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
      const mailOptions = {
        from: 'Reply From 🤖 <s8418g@gmail.com>',
        to: `${recipient}`,
        subject: 'Automatic-Mail-Responder',
        text: 'A NodeJS Application To Reply To Unreplied Emails, Add Labels Automatically',
        html: '<h1>A NodeJS Application To Reply To Unreplied Emails, Add Labels Automatically<h1>',
      };
      const finalResult = await transport.sendMail(mailOptions);
      Res('Success');
    } catch (error) {
      Rej('Fail');
    }
  });
};

module.exports = {
  SendMail,
};
