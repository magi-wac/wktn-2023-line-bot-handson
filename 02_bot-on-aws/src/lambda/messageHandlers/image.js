import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocumentClient, getS3Client } from '../commons';

/**
 * 画像メッセージを処理する
 * @param event Webhook event object
 * @returns メッセージ処理結果
 */
export const imageMessageHandler = async (event) => {
  console.debug(`imageMessageHandler called!: ${JSON.stringify(event)}`);
  // upload image
  const uploadResult = await uploadImageToS3(event);
  console.log(
    `画像メッセージをS3にアップロードしました: ${JSON.stringify(uploadResult)}`,
  );
  const imageUrl = uploadResult.Location;
  // DB に画像メッセージの情報を保存する
  await putImageMessageLog(event, uploadResult);
  // 返信メッセージを作成
  let replyMessages;
  if (imageUrl) {
    console.debug(`画像メッセージのURL: ${imageUrl}`);
    // 画像メッセージで返信する
    replyMessages = [
      {
        type: 'text',
        text: `画像メッセージを受信しました。`,
      },
      {
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl,
      },
    ];
  } else {
    replyMessages = [
      {
        type: 'text',
        text: `画像メッセージを受信しましたが、画像ファイルを取得できませんでした。`,
      },
    ];
  }
  return replyMessages;
};

/**
 * 画像メッセージの画像をS3に保存する
 * @param event Webhook event object
 */
async function uploadImageToS3(event) {
  try {
    const s3Client = getS3Client();
    const userId = event.source.userId;
    const messageId = event.message.id;
    const imageUrl = getImageUrl(event);
    //
    if (!imageUrl) {
      throw new Error('Failed to get image URL');
    }
    console.debug(`メッセージの画像を取得します: ${imageUrl}`);
    let requestConfig = { responseType: 'stream' };
    if (event.message.contentProvider.type === 'line') {
      // LINE の場合、Authorization ヘッダーを付与する
      requestConfig = {
        responseType: 'stream',
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      };
    }
    const imageResponse = await axios.get(imageUrl, requestConfig);
    const fileExtension = getFileExtensionFromContentType(
      imageResponse.headers.getContentType(),
    );
    const imageFileName = `${messageId}.${fileExtension}`; // 画像ファイル名
    // S3 バケット内の画像ファイルのキー
    const imageFileKey = `${userId}/images/${imageFileName}`;
    // upload image to S3
    console.debug(`S3 Bucket へのアップロードを開始: ${imageFileKey}`);
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.LINE_BOT_CONTENTS_BUCKET_NAME,
        Key: imageFileKey,
        Body: imageResponse.data, // ダウンロードした画像ファイルのストリーム
      },
    });
    console.debug(`S3 Bucket へ画像をアップロード中...`);
    const uploadResponse = await upload.done();
    console.log(
      `S3 Bucket への画像のアップロードが完了しました: ${JSON.stringify(uploadResponse)}`,
    );
    const result = {
      Location: uploadResponse.Location,
      Key: uploadResponse.Key,
    };
    return result;
  } catch (error) {
    const errorMessage = `S3 Bucket への画像のアップロードが失敗しました: ${JSON.stringify(
      error,
    )}`;
    console.error(errorMessage);
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
    throw new Error(errorMessage);
  }
}

/**
 * メッセージ画像のURLを取得する
 * @param event Webhook event object
 * @returns メッセージ画像のURL
 */
function getImageUrl(event) {
  const contentProviderType = event.message.contentProvider.type;
  console.debug(`画像の URL を取得します: ${contentProviderType}`);
  let imageUrl;
  switch (contentProviderType) {
    case 'line':
      const messageId = event.message.id;
      imageUrl = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
      break;
    case 'external':
      imageUrl = event.message.contentProvider.originalContentUrl;
      break;
    default:
      imageUrl = null;
      break;
  }
  return imageUrl;
}

/**
 * 画像ファイルの拡張子を取得する
 * @param contentType Content-Type ヘッダーの値
 * @returns 画像ファイルの拡張子
 */
function getFileExtensionFromContentType(contentType) {
  console.debug(`Content-Type ヘッダー [${contentType}] を基に拡張子を取得します`);
  switch (contentType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    default:
      return 'jpg';
  }
}

/**
 * メッセージログを保存する
 * @param event Webhook event object
 * @param uploadResult 画像ファイルのアップロード結果
 * @returns メッセージログの保存結果
 */
async function putImageMessageLog(event, uploadResult) {
  const docClient = getDynamoDBDocumentClient();
  // メッセージログ用テーブル名を環境変数から取得
  const tableName = process.env.LINE_BOT_MESSAGE_LOGS_TABLE_NAME;
  // DB への書き込みを実行するためのコマンドを作成
  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      lineUserId: event.source.userId,
      sentAt: event.timestamp,
      senderType: 'LINE_USER',
      messageId: event.message.id,
      messageType: event.message.type,
      imageUrl: uploadResult.Location,
      imageFileKey: uploadResult.Key,
    },
  });
  // DB への書き込みを実行
  console.debug(`DB への書き込みを実行します: ${JSON.stringify(putCommand)}`);
  const response = await docClient.send(putCommand);
  console.log(`DB への書き込み結果: ${JSON.stringify(response)}`);
  return response.$metadata.httpStatusCode;
}
