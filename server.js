require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const virtualNumber = process.env.VIRTUAL_NUMBER;
const agentNumber = process.env.TO_NUMBER;
const base_url = process.env.NGROK_URL;

app.use(bodyParser.json());
app.use(express.static('static'));

const onInboundCall = (request, response) => {
  const ncco = [
    {
      action: 'talk',
      text:
        "Ahoy mate, thank you for calling on this beautiful day. If you would like to hear a cool song, press 1. If you don't want to look at your phone but want to know what time it is, press 2. If you crave for human contact, press 3",
      bargeIn: true,
      voiceName: 'Russell'
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
          action: 'stream',
          streamUrl: [`${base_url}/hold.mp3`]
        }
      ];
      response.json(ncco);
      break;
    case '2':
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date());
      const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        dayPeriod: 'short'
      }).format(new Date());
      ncco = [
        {
          action: 'talk',
          text: `Today is ${formattedDate} and it is ${formattedTime}`,
          voiceName: 'Russell'
        }
      ];
      response.json(ncco);
      break;
    case '3':
      ncco = [
        {
          action: 'talk',
          text:
            'Great, mate! We are now connecting you to an agent who will be able to help you',
          voiceName: 'Russell'
        },
        {
          action: 'connect',
          from: virtualNumber,
          endpoint: [
            {
              type: 'phone',
              number: agentNumber
            }
          ]
        }
      ];
      response.json(ncco);
      break;

    default:
      ncco = [
        {
          action: 'talk',
          text:
            "I'm sorry I didn't understand what you entered please try again",
          voiceName: 'Russell'
        }
      ];
      response.json(ncco);
      break;
  }
};

app.get('/webhooks/answer', onInboundCall).post('/webhooks/dtmf', onInput);

app.listen(3000);
