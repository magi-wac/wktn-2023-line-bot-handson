/**
 * メンバー参加イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const memberJoinedEventHandler = async (event) => {
  console.debug(`memberJoinedEventHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = {
    type: 'text',
    text: `グループへの参加ありがとうございます！`,
  };
  return replyMessage;
};
