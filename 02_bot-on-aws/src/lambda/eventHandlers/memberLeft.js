/**
 * メンバー退出イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const memberLeftEventHandler = async (event) => {
  console.debug(`memberLeftEventHandler called!: ${JSON.stringify(event)}`);
  console.log(`グループ [${event.source.groupId}] を退出されました`);
  return null;
};
