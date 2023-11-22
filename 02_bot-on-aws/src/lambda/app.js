const express = require('express');
const line = require('@line/bot-sdk');
import {
  messageEventHandler,
  unsendEventHandler,
  followEventHandler,
  unfollowEventHandler,
  joinEventHandler,
  leaveEventHandler,
  memberJoinedEventHandler,
  memberLeftEventHandler,
  postbackEventHandler,
  videoPlayCompleteEventHandler,
} from './eventHandlers';

const lineBotConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

/**
 * Webhook event に応じたイベントハンドラー
 *
 * Webhookイベントのタイプ
 * @see https://developers.line.biz/ja/docs/messaging-api/receiving-messages/#webhook-event-types
 */
const eventHandlers = {
  message: messageEventHandler,
  unsend: unsendEventHandler,
  follow: followEventHandler,
  unfollow: unfollowEventHandler,
  join: joinEventHandler,
  leave: leaveEventHandler,
  memberJoined: memberJoinedEventHandler,
  memberLeft: memberLeftEventHandler,
  postback: postbackEventHandler,
  videoPlayComplete: videoPlayCompleteEventHandler,
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
 * Webhook event に応じたイベントハンドラーを取得する
 * @param event Webhook event object
 */
function getEventHandler(event) {
  const handler = eventHandlers[event.type];
  if (!handler) {
    console.warn(`未知のイベントタイプ [${event.type}] が発生しました`);
    return undefined;
  }
  return handler;
}

/**
 * イベントを処理する
 * @param event Webhook event object
 * @returns
 */
async function handleEvent(event) {
  const handler = getEventHandler(event);
  if (!handler) {
    // 未知のイベントタイプの場合、何もしない
    return Promise.resolve(null);
  }
  let replyMessage;
  try {
    // イベントハンドラーを実行して、返信メッセージを取得する
    replyMessage = await handler(event);
  } catch (error) {
    console.error(`イベントの処理中にエラーが発生しました: ${JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
    replyMessage = { type: 'text', text: 'エラーが発生しました' };
  }
  console.log(`返信メッセージ: [${JSON.stringify(replyMessage)}]`);
  if (!replyMessage) {
    // 返信メッセージがない場合、何もしない
    return Promise.resolve(null);
  }
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [replyMessage],
  });
}

app.use('/', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
