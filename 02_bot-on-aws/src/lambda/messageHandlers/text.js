import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocumentClient } from '../commons';

/**
 * テキストメッセージを処理する
 * @param event Webhook event object
 * @returns メッセージ処理結果
 */
export const textMessageHandler = async (event) => {
  console.debug(`textMessageHandler called!: ${JSON.stringify(event)}`);
  // メッセージログを保存
  await putTextMessageLog(event);
  const receivedMessage = event.message.text;
  const replyMessage = { type: 'text', text: receivedMessage };
  return [replyMessage];
};

/**
 * メッセージログを保存する
 * @param event Webhook event object
 * @returns メッセージログの保存結果
 */
async function putTextMessageLog(event) {
  const docClient = getDynamoDBDocumentClient();
  // メッセージログ用テーブル名を環境変数から取得
  const tableName = process.env.LINE_BOT_MESSAGE_LOGS_TABLE_NAME;
  // @see https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html
  // DB への書き込みを実行するためのコマンドを作成
  // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/PutItemCommand/
  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      lineUserId: event.source.userId,
      sentAt: event.timestamp,
      senderType: 'LINE_USER',
      messageId: event.message.id,
      messageType: event.message.type,
      messageText: event.message.text,
    },
  });
  // DB への書き込みを実行
  console.debug(`DB への書き込みを実行します: ${JSON.stringify(putCommand)}`);
  const response = await docClient.send(putCommand);
  console.log(`DB への書き込み結果: ${JSON.stringify(response)}`);
  return response.$metadata.httpStatusCode;
}
