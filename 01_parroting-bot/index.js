require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

const lineBotConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

// create Express app
const app = express();
// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(lineBotConfig);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * LINE BOTのWebhookにPOSTリクエストを送ると、この処理が実行される
 */
app.post('/webhook', line.middleware(lineBotConfig), (req, res) => {
  console.log(`LINE Webhook を受信しました: ${JSON.stringify(req.body.events)}`);

  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((error) => {
      console.error(`Webhook の処理中にエラーが発生しました: ${JSON.stringify(error)}`);
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }
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

app.listen(PORT, () => {
  console.log(`Parroting bot app listening on port ${PORT}`);
});
