import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

/**
 * DynamoDBDocumentClient を取得する
 * @returns DynamoDBDocumentClient
 */
export const getDynamoDBDocumentClient = () => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  return docClient;
};

/**
 * S3Client を取得する
 * @returns S3Client
 */
export const getS3Client = () => {
  const client = new S3Client({});
  return client;
};
