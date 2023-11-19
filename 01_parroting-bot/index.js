require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

// create Express app
const app = express();
// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(config);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * LINE BOTのWebhookにPOSTリクエストを送ると、この処理が実行される
 */
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(`Webhook events: ${JSON.stringify(req.body.events)}`);

  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

/**
 * イベントを処理する
 * @param event Webhook event object
 * @returns
 */
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  // ユーザーからのメッセージがテキストの場合、そのままオウム返しする
  const echo = { type: 'text', text: event.message.text };
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
