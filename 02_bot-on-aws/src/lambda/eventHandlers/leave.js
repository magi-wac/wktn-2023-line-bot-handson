/**
 * 退出イベントを処理して、返信メッセージを取得する
 * @param event Webhook event object
 * @returns 返信メッセージ
 */
export const leaveEventHandler = async (event) => {
  console.debug(`leaveEventHandler called!: ${JSON.stringify(event)}`);
  console.log(`グループ [${event.source.groupId}] を退出されました`);
  return null;
};
