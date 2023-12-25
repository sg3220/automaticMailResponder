const { SendMail } = require('./sendMail.js');

//--> Creating A New Label
//-->GMail-API-Used: users.labels.create()
const createLabel = async (gmailInstance, labelName) => {
  return new Promise(async (Res, Rej) => {
    try {
      const newLabelConfiguration = {
        name: labelName,
        labelListVisibility: 'labelshow',
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

      const labelID = objectResult.data.id;

      console.log(`messageFromServer: Label Creation✅, ID: ${labelID}`);
      Res({ status: 'Success', labelID: labelID });
    } catch (MyError) {
      Rej({ status: 'Fail', functionName: 'createLabel()' });
    }
  });
};

//--> Check If Label Exists Or Not In User's Labels List
//-->GMail-API-Used: users.labels.list()
const checkLabel = (gmailInstance, labelName) => {
  return new Promise(async (Res, Rej) => {
    try {
      const objectResult = await gmailInstance.users.labels.list({
        userId: 'me',
      });
      const arrayOfLabels = objectResult.data.labels;
      let labelID = '';
      for (let i in arrayOfLabels) {
        if (arrayOfLabels[i]['name'] === labelName) {
          labelID = arrayOfLabels[i]['id'];
        }
      }
      Res({ status: 'Success', labelID: labelID });
    } catch (myError) {
      Rej({ status: 'Fail', functionName: 'checkLabel()' });
    }
  });
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
      Res({ status: 'Success' });
    } catch (myError) {
      Rej({ status: 'Fail', functionName: 'modifyLabels()' });
    }
  });
};

const retrieveAndValidateEmail = (emailString) => {
  const index01 = emailString.indexOf('<');
  const index02 = emailString.indexOf('>');
  const senderEmail = emailString.slice(index01 + 1, index02);
  const processedName = emailString.split(' ')[0];
  let senderName = '';
  if (!/[a-zA-Z]/.test(processedName[0])) {
    senderName = processedName.slice(1, processedName.length + 1);
  } else {
    senderName = processedName;
  }
  const senderDetails = {
    senderEmail: senderEmail,
    mailSubject: '🌴 Out On Vacation',
    mailText: `👋 ${senderName}, Thanks For Mailing I'm Currently Chilling...I Will Revert Back As Soon As I Get Back To Work`,
  };
  return senderDetails;
};

//-->GMail-API-Used: users.messages.list()
//-->GMail-API-Used: users.messages.get()
const extractAndMessage = async (gmailInstance, oAuth2Client) => {
  return new Promise(async (Res, Rej) => {
    try {
      const unreadMessages = await gmailInstance.users.messages.list({
        userId: 'me',
        q: 'is:unread',
      });
      // console.log(unreadMessages);

      let arrayOfObject = unreadMessages.data.messages;
      if (arrayOfObject === undefined) {
        Res({ status: 'No New Mail✅' });
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
              console.log(emailString);
              break;
            }
          }

          const senderDetails = retrieveAndValidateEmail(emailString);
          console.log('senderDetails:');
          console.log(senderDetails);

          const sendResult = await SendMail(senderDetails, oAuth2Client);
          console.log('messageFromServer: Email Sent✅');
          if (sendResult['status'] === 'Success') {
            let labelID;
            let resultObject = await checkLabel(gmailInstance, 'ASD');
            labelID = resultObject['labelID'];
            let resultObject02;
            if (labelID.length === 0) {
              resultObject02 = await createLabel(gmailInstance, 'ASD');
              labelID = resultObject02['labelID'];
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
      Res({ status: 'All Mail Responded✅' });
    } catch (myError) {
      Rej({ status: 'Fail', functionName: myError.functionName });
    }
  });
};

module.exports = {
  extractAndMessage,
};
