## Showcase of Vonage Voice API

This project is an implementation of the Certification Project for the Voice API from Vonage. See [here](https://vonage-workshop.nexmodev.com/voice/certification/certification-project/) for details.

To run this project locally follow the steps below:

- Setup and start `ngrok` against port 3000
```bash
ngrok http 3000
```
Hereafter we will refer to the ngrok URL as `baseUrl`.

- Visit your Vonage Dashboard and perform the following if you haven't:
  - Purchase a phone number (copy the number, you will need it)
  - Create a new Application (or use an existing one) with Voice Enabled
  - Configure the Event Webhook URL of your Vonage Application to point `${baseUrl}/webhooks/answer`
  - Make sure to link your phone number with the Vonage Application

- Get a copy of the project and install the dependencies
```bash
git clone git@github.com:nbermudezs/vonage-voice-api-cert-project.git
cd vonage-voice-api-cert-project
npm install
```

- Configure the necessary environment variables
```bash
cp .env.example .env
```
then open `.env` and input ALL environment variables.

- Run it!
```bash
node server.js
```

- Now call your Vonage number to get started.

