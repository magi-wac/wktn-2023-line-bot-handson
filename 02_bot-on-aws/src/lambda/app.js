const express = require('express');
const line = require('@line/bot-sdk');

const lineBotConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

// create Express app
const app = express();
const router = express.Router();
// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(lineBotConfig);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * LINE BOTのWebhookにPOSTリクエストを送ると、この処理が実行される
 */
router.post('/webhook', line.middleware(lineBotConfig), (req, res) => {
  console.log(`LINE Webhook を受信しました: ${JSON.stringify(req.body.events)}`);

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
  console.log(`メッセージ [${event.message.text}] をオウム返しします`);
  // ユーザーからのメッセージがテキストの場合、そのままオウム返しする
  const echo = { type: 'text', text: event.message.text };
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

app.use('/', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
