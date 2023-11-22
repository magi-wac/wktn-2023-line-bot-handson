/**
 * ポストバックイベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const postbackEventHandler = async (event) => {
  console.debug(`postbackEventHandler called!: ${JSON.stringify(event)}`);
  const postbackData = event.postback.data;
  const replyMessage = {
    type: 'text',
    text: `ポストバックデータ [${postbackData}] を受信しました`,
  };
  return replyMessage;
};
