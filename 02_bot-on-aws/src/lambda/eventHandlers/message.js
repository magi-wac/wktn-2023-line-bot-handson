import { textMessageHandler, imageMessageHandler } from '../messageHandlers';

// メッセージ種別ごとのハンドラーを定義
const messageHandlers = {
  text: textMessageHandler,
  image: imageMessageHandler,
};

/**
 * メッセージ種別に応じたメッセージハンドラーを取得する
 * @param event Webhook event object
 * @returns messageHandler
 */
function getMessageHandler(event) {
  const handler = messageHandlers[event.message.type];
  if (!handler) {
    console.warn(`メッセージタイプ [${event.message.type}] には対応していません`);
    return undefined;
  }
  return handler;
}

/**
 * メッセージを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const messageEventHandler = async (event, lineMessagingApiClient) => {
  console.debug(`messageEventHandler called!`);
  const handler = getMessageHandler(event);
  if (!handler) {
    // 未対応のメッセージタイプの場合、その旨のメッセージを返す
    return {
      type: 'text',
      text: `メッセージタイプ [${event.message.type}] には対応していません`,
    };
  }
  let replyMessages;
  try {
    // メッセージハンドラーを実行して、返信メッセージを取得する
    replyMessages = await handler(event);
  } catch (error) {
    console.error(`メッセージ処理中にエラーが発生しました: ${JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
    replyMessages = { type: 'text', text: 'メッセージ処理中にエラーが発生しました' };
  }
  return replyMessages;
};
