/**
 * LINE でのメッセージ送信者を表すプレフィックス
 */
export const LINE_MESSAGE_SENDER_PREFIX = 'LINE_';

/**
 * LINE USER ID から DB 保存用のメッセージ送信者 ID を作成する
 * @param lineUserId LINE USER ID
 * @returns DB 保存用のメッセージ送信者 ID
 */
export const createLineMessageSenderId = (lineUserId) => {
  return `${LINE_MESSAGE_SENDER_PREFIX}${lineUserId}`;
};
