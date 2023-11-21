const { Stack, Duration } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
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

    // S3 バケットの作成
    new s3.Bucket(this, 'LineBotContentsBucket', {
      versioned: true,
      // スタックを削除したときに自動的に削除されるようにする
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // example resource
    // const queue = new sqs.Queue(this, '02BotOnAwsQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { LineBotStack };
