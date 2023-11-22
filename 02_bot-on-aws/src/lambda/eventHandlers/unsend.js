/**
 * 送信取消イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const unsendEventHandler = async (event) => {
  console.debug(`unsendEventHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = {
    type: 'text',
    text: `送信取消イベントを受信しました\n取り消された messageId: ${event.unsend.messageId}`,
  };
  return replyMessage;
};
