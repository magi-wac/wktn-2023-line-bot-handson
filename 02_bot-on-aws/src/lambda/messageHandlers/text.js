import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const textMessageHandler = async (event) => {
  console.debug(`textMessageHandler called!: ${JSON.stringify(event)}`);
  // メッセージログ用テーブル名を環境変数から取得
  const tableName = process.env.LINE_BOT_MESSAGE_LOGS_TABLE_NAME;
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      senderId: `LINE_${event.source.userId}`,
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

  const replyMessage = { type: 'text', text: event.message.text };
  return replyMessage;
};
