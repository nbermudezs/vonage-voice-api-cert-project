require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const origin_phone_number = process.env.VIRTUAL_NUMBER;
const sales_office_number = process.env.TO_NUMBER;
const base_url = process.env.NGROK_URL;

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY_PATH
});

app.use(bodyParser.json());

//Add extra code that you create in this exercise here

const onInboundCall = (request, response) => {
  const ncco = [
    {
      action: 'talk',
      text:
        "Hello, welcome to Acme Systems Incorporated's Interactive Voice Response System. To speak with Sales press 1. For Customer Support press 2. For the press office, press 3",
      bargeIn: true
    },
    {
      action: 'input',
      eventUrl: [`${base_url}/webhooks/dtmf`],
      maxDigits: 1
    }
  ];

  response.json(ncco);
};

const onInput = (request, response) => {
  const dtmf = request.body.dtmf;
  var ncco;

  switch (dtmf) {
    case '1':
      ncco = [
        {
          action: 'talk',
          text: `You have asked to speak with the Sales Department, Connecting you now.`
        },
        {
          action: 'connect',
          from: origin_phone_number,
          endpoint: [
            {
              type: 'phone',
              number: sales_office_number
            }
          ]
        }
      ];
      response.json(ncco);
      break;
    case '2':
      ncco = [
        {
          action: 'talk',
          text:
            'You have asked to speak with customer service, please input your 5 digit account number followed by the pound sign'
        },
        {
          action: 'input',
          eventUrl: [`${base_url}/webhooks/accountInput`],
          timeOut: 10,
          maxDigits: 6,
          submitOnHash: true
        }
      ];
      response.json(ncco);
      break;
    case '3':
      ncco = [
        {
          action: 'talk',
          text:
            'You have asked to speak with the press office. Unfortunately no one from the press office is currently available. Please leave a message after the tone.'
        },
        {
          action: 'record',
          beepStart: true,
          eventUrl: [`${base_url}/webhooks/recordingFinished`],
          endOnSilence: 3
        }
      ];
      response.json(ncco);
      break;

    default:
      ncco = [
        {
          action: 'talk',
          text:
            "I'm sorry I didn't understand what you entered please try again"
        }
      ];
      response.json(ncco);
      break;
  }
};

const onAccountInput = (request, response) => {
  const dtmf = request.body.dtmf;
  const input = dtmf.split('').join(' ');
  const ncco = [
    {
      action: 'talk',
      text:
        'Your account number is: ' +
        input +
        ' your case has been added and is being actively triaged, you will be contacted with an update to your case in 24 hours'
    }
  ];
  response.json(ncco);
  response.status(200).send();
};

const onEvent = (request, response) => {
  response.status(200).send();
};

const onRecordingFinished = (request, response) => {
  console.log(request.body.recording_url);
  nexmo.files.save(request.body.recording_url, 'test.mp3', (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
  response.status(200).send();
};

app
  .get('/webhooks/answer', onInboundCall)
  .post('/webhooks/dtmf', onInput)
  .post('/webhooks/events', onEvent)
  .post('/webhooks/accountInput', onAccountInput)
  .post('/webhooks/recordingFinished', onRecordingFinished);

app.listen(3000);
