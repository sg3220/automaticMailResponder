const { SendMail } = require('./sendMail.js');

//--> Creating A New Label
//-->GMail-API-Used: users.labels.create()
const createLabel = async (gmailInstance) => {
  return new Promise(async (Res, Rej) => {
    try {
      const newLabelConfiguration = {
        name: 'PUSH',
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        type: 'user',
        color: {
          backgroundColor: '#83334c',
          textColor: '#ffffff',
        },
      };

      const objectResult = await gmailInstance.users.labels.create({
        userId: 'me',
        resource: newLabelConfiguration,
      });

      const stringLabelID = objectResult.data.id;

      console.log(`messageFromServer: Label Creation✅, ID: ${stringLabelID}`);
      Res(stringLabelID);
    } catch (error) {
      console.error(`messageFromServer: Label Creation❌`);
    }
  });
};

//--> Check If Label Exists Or Not In User's Labels List
//-->GMail-API-Used: users.labels.list()
const checkLabel = async (gmailInstance) => {
  const objectResult = await gmailInstance.users.labels.list({ userId: 'me' });
  const arrayOfLabels = objectResult.data.labels;
  for (let i in arrayOfLabels) {
    if (arrayOfLabels[i]['name'] === 'PUSH') {
      return arrayOfLabels[i]['id'];
    }
  }
  return '';
};

//--> Modify Labels(After Sending Email)
//-->GMail-API-Used: users.messages.modify()
const modifyLabels = async (gmailInstance, id, labelConfig) => {
  return new Promise(async (Res, Rej) => {
    try {
      await gmailInstance.users.messages.modify({
        userId: 'me',
        id: id,
        resource: labelConfig,
      });
      console.log('messageFromServer: Label Modification✅');
      Res('Success');
    } catch (error) {
      console.error('messageFromServer: Label Modification❌');
      Rej('Fail');
    }
  });
};

//-->GMail-API-Used: users.messages.list()
//-->GMail-API-Used: users.messages.get()
const extractAndMessage = async (gmailInstance, oAuth2Client, myLabel) => {
  const unreadMessages = await gmailInstance.users.messages.list({
    userId: 'me',
    q: 'is:unread',
  });

  let arrayOfObject = unreadMessages.data.messages;
  if (arrayOfObject === undefined) {
    arrayOfObject = [];
    console.log(arrayOfObject);
    return 1;
  }

  for (let i in arrayOfObject) {
    if (arrayOfObject[i]['id'] === arrayOfObject[i]['threadId']) {
      const dataOfOneMail = await gmailInstance.users.messages.get({
        userId: 'me',
        id: arrayOfObject[i]['id'],
      });
      const Headers = dataOfOneMail.data.payload.headers;
      let emailString = '';
      for (let j in Headers) {
        if (Headers[j].name === 'From') {
          emailString = Headers[j].value;
          break;
        }
      }
      const match = emailString.match(/<([^>]+)>/);
      if (match && match[1]) {
        const extractedEmail = match[1];
        console.log(`Email Received From: ${extractedEmail}`);

        const sendMailResult = await SendMail(extractedEmail, oAuth2Client);
        if (sendMailResult === 'Success') {
          let labelID = await checkLabel(gmailInstance, myLabel);
          if (labelID.length === 0) {
            labelID = await createLabel(gmailInstance, myLabel);
          }
          const labelConfig = {
            addLabelIds: [labelID],
            removeLabelIds: ['UNREAD'],
          };
          const modifyLabelsResult = await modifyLabels(
            gmailInstance,
            arrayOfObject[i]['id'],
            labelConfig
          );
        }
      }
    }
  }
  return 1;
};

module.exports = {
  extractAndMessage,
};
