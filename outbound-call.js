require('dotenv').config();
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY_PATH
});

nexmo.calls.create({
  to: [
    {
      type: 'phone',
      number: process.env.TO_NUMBER
    }
  ],
  from: {
    type: 'phone',
    number: process.env.VIRTUAL_NUMBER
  },
  ncco: [
    {
      action: 'talk',
      text: 'This is a text to speech call from Vonage'
    }
  ]
});
