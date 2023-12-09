#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { LineBotStack } = require('../lib/line-bot-stack');
require('dotenv').config();

// .env に定義した AWS アカウント番号を設定
const awsAccountNo = process.env.AWS_ACCOUNT_NO;
const stackProps = {
  env: { account: awsAccountNo, region: 'ap-northeast-1' },
};
console.log(`stackProps: ${JSON.stringify(stackProps)}`);

// .env に定義した LINE Messaging API のチャネルアクセストークンとチャネルシークレットを設定
const lineBotConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};
console.log(`lineBotConfig: ${JSON.stringify(lineBotConfig)}`);

// 環境構築
const app = new cdk.App();
const stack = new LineBotStack(app, 'LineBotHandsOnStack-magi', stackProps, lineBotConfig);

// タグ付け
cdk.Tags.of(stack).add('ServiceName', 'NISSAY IT WACKATHON 2023 Hands on');
