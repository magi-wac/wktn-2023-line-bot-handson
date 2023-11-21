const { Stack, Duration, RemovalPolicy, CfnOutput } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
// const sqs = require('aws-cdk-lib/aws-sqs');

class LineBotStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // DynamoDb テーブルの作成
    const lineBotMessageLogsTable = new dynamodb.Table(this, 'LineBotMessageLogsTable', {
      tableName: 'LineBotMessageLogs',
      partitionKey: {
        name: 'senderId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sentAt',
        type: dynamodb.AttributeType.NUMBER,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // オンデマンド
      removalPolicy: RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除
    });
    new CfnOutput(this, 'LineBotMessageLogsTableNameAndArn', {
      description: 'DynamoDB LineBotMessageLogsTable Name and Arn',
      value: `${lineBotMessageLogsTable.tableName} : ${lineBotMessageLogsTable.tableArn}`,
    });

    // S3 バケットの作成
    const lineBotContentsBucket = new s3.Bucket(this, 'LineBotContentsBucket', {
      versioned: false,
      // スタックを削除したときに自動的に削除されるようにする
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new CfnOutput(this, 'LineBotContentsBucketNameAndArn', {
      description: 'DynamoDB LineBotContentsBucket Name and Arn',
      value: `${lineBotContentsBucket.bucketName} : ${lineBotContentsBucket.bucketArn}`,
    });

    // example resource
    // const queue = new sqs.Queue(this, '02BotOnAwsQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { LineBotStack };
