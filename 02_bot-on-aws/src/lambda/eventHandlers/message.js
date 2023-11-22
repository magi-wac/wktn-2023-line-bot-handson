import { textMessageHandler } from '../messageHandlers';

// メッセージ種別ごとのハンドラーを定義
const messageHandlers = {
  text: textMessageHandler,
};

/**
 * メッセージ種別に応じたメッセージハンドラーを取得する
 * @param event Webhook event object
 * @returns messageHandler
 */
function getMessageHandler(event) {
  const handler = messageHandlers[event.message.type];
  if (!handler) {
    console.warn(`未知のメッセージタイプ [${event.message.type}] が発生しました`);
    return undefined;
  }
  return handler;
}

/**
 * メッセージを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const messageEventHandler = async (event) => {
  console.debug(`messageEventHandler called!`);
  const handler = getMessageHandler(event);
  if (!handler) {
    // 未知のメッセージタイプの場合、何もしない
    return Promise.resolve(null);
  }
  let replyMessage;
  try {
    // メッセージハンドラーを実行して、返信メッセージを取得する
    replyMessage = await handler(event);
  } catch (error) {
    console.error(`メッセージの処理中にエラーが発生しました: ${JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
    replyMessage = { type: 'text', text: 'エラーが発生しました' };
  }
  return replyMessage;
};
