/**
 * フォロー解除イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const unfollowEventHandler = async (event) => {
  console.debug(`unfollowEventHandler called!: ${JSON.stringify(event)}`);
  console.log(`フォロー解除されました: ${event.source.userId}`);
  return null;
};
