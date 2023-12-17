const { SendMail } = require('./SendMail.JS');

const createLabel = async (gmailInstance, nameOfLabel) => {
  return new Promise(async (Res, Rej) => {
    try {
      const newLabelConfiguration = {
        name: nameOfLabel,
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
      console.log(`Created New Label With ID: ${stringLabelID}`);
      Res(stringLabelID);
    } catch (error) {
      console.error('FAILED-TO-CREATE-LABEL');
      Rej('');
    }
  });
};

const checkLabel = async (gmailInstance) => {
  const objectResult = await gmailInstance.users.labels.list({ userId: 'me' });
  const arrayOfLabels = objectResult.data.labels; //--> Array Of Objects
  let labelID = '';
  for (let i in arrayOfLabels) {
    if (arrayOfLabels[i]['name'] === 'AUTO') {
      labelID = arrayOfLabels[i]['id'];
      break;
    }
  }
  if (labelID.length === 0) {
    labelID = await createLabel(gmailInstance, 'AUTO');
    if (labelID.length === 0) {
      return '';
    }
  }
  return labelID;
};

const modifyLabels = async (gmailInstance, id, labelConfig) => {
  return new Promise(async (Res, Rej) => {
    try {
      await gmailInstance.users.messages.modify({
        userId: 'me',
        id: id,
        resource: labelConfig,
      });
      Res('Success');
    } catch (error) {
      Rej('Fail');
    }
  });
};

const checkAndRespond = async (gmailInstance, id, oAuth2Client) => {
  try {
    const dataOfOneMail = await gmailInstance.users.messages.get({
      userId: 'me',
      id: id,
    });
    const labelsOfOneMail = dataOfOneMail.data.labelIds;

    const labelID = await checkLabel(gmailInstance);
    if (labelID.length === 0) {
      console.error('FAILED-TO-RETRIEVE-CREATE-labelID');
    } else {
      if (labelsOfOneMail.includes('UNREAD')) {
        const labelConfig = {
          addLabelIds: [labelID],
          removeLabelIds: ['UNREAD'],
        };

        const Status = await modifyLabels(gmailInstance, id, labelConfig);

        if (Status === 'Success') {
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
            console.log(`Sending Auto-Reply To : ${extractedEmail}`);
            const finalMessage = await SendMail(extractedEmail, oAuth2Client);
            if (finalMessage === 'Fail') {
              console.error('FAILED-TO-SEND-MAIL');
            }
          } else {
            console.error('FAILED-TO-EXTRACT-MAIL');
          }
        } else {
          console.error('FAILED-TO-LABEL-MAIL');
        }
      }
    }
  } catch (Error) {
    console.error('FAILED-TO-CHECK-RESPOND');
  }
};

const extractMessageID = async (gmailInstance, oAuth2Client) => {
  //--> Object of Array/Object
  //--> Lists The Messages In The User's Mailbox.
  const mailBox = await gmailInstance.users.messages.list({ userId: 'me' });

  //--> Array of Objects
  const arrayOfMailID = mailBox.data.messages;

  for (let i in arrayOfMailID) {
    await checkAndRespond(gmailInstance, arrayOfMailID[i]['id'], oAuth2Client);
  }
};

module.exports = {
  extractMessageID,
};
