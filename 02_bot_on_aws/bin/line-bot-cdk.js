#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { LineBotStack } = require('../lib/line-bot-stack');

// ご自身のアカウント番号を入力してください
const accountNo = '';
const stackProps = {
  env: { account: accountNo, region: 'ap-northeast-1' },
};

// LINE Messaging API のチャネルアクセストークンとチャネルシークレットを入力してください
const lineBotConfig = {
  channelSecret: '',
  channelAccessToken: '',
};

// 環境構築
const app = new cdk.App();
const stack = new LineBotStack(app, 'LineBotStack', stackProps, lineBotConfig);

// タグ付け
cdk.Tags.of(stack).add('ServiceName', 'NISSAY IT WACKATHON 2023 Hands on');
