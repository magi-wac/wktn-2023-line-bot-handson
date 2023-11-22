/**
 * 動画視聴完了イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const videoPlayCompleteEventHandler = async (event) => {
  console.debug(`videoPlayCompleteEventHandler called!: ${JSON.stringify(event)}`);
  const trackingId = event.videoPlayComplete.trackingId;
  const replyMessage = {
    type: 'text',
    text: `動画ID [${trackingId}] の視聴が完了しました`,
  };
  return replyMessage;
};
