/**
 * 参加イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const joinEventHandler = async (event) => {
  console.debug(`joinEventHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = {
    type: 'text',
    text: `グループへの参加ありがとうございます！`,
  };
  return [replyMessage];
};
