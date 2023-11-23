import { S3Client, CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';

export const imageMessageHandler = async (event) => {
  console.debug(`imageMessageHandler called!: ${JSON.stringify(event)}`);
  // upload image
  const location = await uploadImageToS3(event);
  const replyMessage = {
    type: 'text',
    text: `画像メッセージを受信しました: ${location}`,
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
    const messageId = event.message.id;
    const imageUrl = event.message.contentProvider.originalContentUrl;
    //
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const contentType = imageResponse.headers.getContentType();
    const fileExtension = getFileExtensionFromContentType(contentType);
    const imageFileName = `${messageId}.${fileExtension}`;
    const fileStream = imageResponse.data;
    // upload image to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.LINE_BOT_CONTENTS_BUCKET_NAME,
        Key: imageFileName,
        Body: fileStream,
      },
    });
    console.log(`S3 Bucket へ画像をアップロード中... : ${JSON.stringify(upload)}`);
    const uploadResponse = await upload.done();
    if (!(uploadResponse instanceof CompleteMultipartUploadCommandOutput)) {
      throw new Error('Failed to upload image to S3');
    }
    console.log(
      `S3 Bucket への画像のアップロードが完了しました: ${JSON.stringify(uploadResponse)}`,
    );
    return uploadResponse.Location;
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
