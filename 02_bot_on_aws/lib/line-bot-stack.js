const { Stack, Duration, RemovalPolicy, CfnOutput } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apiGateway = require('aws-cdk-lib/aws-apigateway');

class LineBotStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   * @param {object} lineBotConfig
   */
  constructor(scope, id, props, lineBotConfig) {
    super(scope, id, props);

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

    // Lambda 関数の作成
    const lineBotFunction = new lambda.Function(this, 'LineBotFunction', {
      functionName: 'LineBotFunction',
      description: 'NISSAY IT WACKATHON 2023 Hands on LINE Bot',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda/line-bot.handler',
      environment: {
        LINE_CHANNEL_SECRET: this.lineBotConfig.channelSecret,
        LINE_CHANNEL_ACCESS_TOKEN: this.lineBotConfig.channelAccessToken,
        LINE_BOT_CONTENTS_BUCKET_NAME: lineBotContentsBucket.bucketName,
        LINE_BOT_MESSAGE_LOGS_TABLE_NAME: lineBotMessageLogsTable.tableName,
      },
      removalPolicy: RemovalPolicy.DESTROY, // スタック削除時に関数も削除
    });
    new CfnOutput(this, 'LineBotFunctionNameAndArn', {
      description: 'Lambda LineBotFunction Name and Arn',
      value: `${lineBotFunction.functionName} : ${lineBotFunction.functionArn}`,
    });

    // API Gateway の作成
    const apiGw = new apiGateway.RestApi(this, 'LineBotApiGateway', {
      deployOptions: {
        tracingEnabled: true,
        stageName: 'prod',
      },
      removalPolicy: RemovalPolicy.DESTROY, // スタック削除時に API Gateway も削除
    });
    apiGw.root.addProxy({
      defaultIntegration: new apiGateway.LambdaIntegration(lineBotFunction),
    });
    new CfnOutput(this, 'LineBotApiGatewayUrl', {
      description: 'ApiGateway LineBotApiGateway URL',
      value: `${apiGw.url}`,
    });
  }
}

module.exports = { LineBotStack };
