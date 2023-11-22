/**
 * 送信取消イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const unsendEventHandler = async (event) => {
  console.debug(`unsendEventHandler called!: ${JSON.stringify(event)}`);
  console.log(
    `送信取消イベントを受信しました [取り消された messageId: ${event.unsend.messageId}]`,
  );
  return null;
};
