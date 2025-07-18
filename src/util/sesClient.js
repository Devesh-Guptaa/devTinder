const { SESClient } = require('@aws-sdk/client-ses');

const REGION = 'ap-south-1';

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AMAZON_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SES_SECRET_ACCESS_KEY,
  },
});
module.exports = { sesClient };
