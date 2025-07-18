const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('../util/sesClient.js');

const createSendEmailCommand = (toAddress, fromAddress, toUserFirstName) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<h1>Connection request sent to ${toUserFirstName}</h1>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Connection request : CodeCrush',
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const sendEmail = async (toUserFirstName) => {
  const sendEmailCommand = createSendEmailCommand(
    'deveshgupta231@gmail.com',
    'abhay.singh26111999@gmail.com',
    toUserFirstName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === 'MessageRejected') {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { sendEmail };
