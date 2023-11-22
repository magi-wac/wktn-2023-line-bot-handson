import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createLineMessageSenderId } from '../commons';

/**
 * テキストメッセージを処理する
 * @param event Webhook event object
 * @returns メッセージ処理結果
 */
export const textMessageHandler = async (event) => {
  console.debug(`textMessageHandler called!: ${JSON.stringify(event)}`);
  // メッセージログを保存
  await putTextMessage(event);
  const replyMessage = { type: 'text', text: event.message.text };
  return replyMessage;
};

/**
 * メッセージログを保存する
 * @param event Webhook event object
 * @returns メッセージログの保存結果
 */
async function putTextMessage(event) {
  // メッセージログ用テーブル名を環境変数から取得
  const tableName = process.env.LINE_BOT_MESSAGE_LOGS_TABLE_NAME;
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  // DB への書き込みを実行するためのコマンドを作成
  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      senderId: createLineMessageSenderId(event.source.userId),
      sentAt: event.timestamp,
      senderType: 'LINE',
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
