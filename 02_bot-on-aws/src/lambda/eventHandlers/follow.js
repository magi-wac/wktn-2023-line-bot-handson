/**
 * フォローイベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const followEventHandler = async (event) => {
  console.debug(`followEventHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = {
    type: 'text',
    text: `友だち追加ありがとうございます！`,
  };
  return replyMessage;
};
