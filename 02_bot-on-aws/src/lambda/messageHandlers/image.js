import { S3Client, CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';

export const imageMessageHandler = async (event) => {
  console.debug(`imageMessageHandler called!: ${JSON.stringify(event)}`);
  // upload image
  const uploadResult = await uploadImageToS3(event);
  console.log(
    `画像メッセージをS3にアップロードしました: ${JSON.stringify(uploadResult)}`,
  );
  const replyMessage = {
    type: 'text',
    text: `画像メッセージを受信しました: ${uploadResult.Location}`,
  };
  return replyMessage;
};

/**
 * 画像メッセージの画像をS3に保存する
 * @param event Webhook event object
 */
async function uploadImageToS3(event) {
  try {
    const s3Client = new S3Client({});
    const userId = event.source.userId;
    const messageId = event.message.id;
    const imageUrl = getImageUrl(event);
    //
    if (!imageUrl) {
      throw new Error('Failed to get image URL');
    }
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const contentType = imageResponse.headers.getContentType();
    const fileExtension = getFileExtensionFromContentType(contentType);
    const imageFileName = `${messageId}.${fileExtension}`; // 画像ファイル名
    // S3 バケット内の画像ファイルのキー
    const imageFileKey = `${userId}/images/${imageFileName}`;
    const fileStream = imageResponse.data;
    // upload image to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.LINE_BOT_CONTENTS_BUCKET_NAME,
        Key: imageFileKey,
        Body: fileStream,
      },
    });
    console.debug(`S3 Bucket へ画像をアップロード中... : ${JSON.stringify(upload)}`);
    const uploadResponse = await upload.done();
    if (!(uploadResponse instanceof CompleteMultipartUploadCommandOutput)) {
      throw new Error('Failed to upload image to S3');
    }
    console.log(
      `S3 Bucket への画像のアップロードが完了しました: ${JSON.stringify(uploadResponse)}`,
    );
    const result = {
      Location: uploadResponse.Location,
      Key: uploadResponse.Key,
    };
    return result;
  } catch (error) {
    console.error(
      `S3 Bucket への画像のアップロードが失敗しました: ${JSON.stringify(error)}`,
    );
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }
  }
}

function getImageUrl(event) {
  const contentProviderType = event.message.contentProvider.type;
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
  return contentProviderType.originalContentUrl;
}

function getFileExtensionFromContentType(contentType) {
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
