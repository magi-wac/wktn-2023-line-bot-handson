#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { LineBotStack } = require('../lib/line-bot-stack');

// ご自身のアカウント番号を入力してください
const accountNo = '647959552099';
const stackProps = {
  env: { account: accountNo, region: 'ap-northeast-1' },
};

const app = new cdk.App();
new LineBotStack(app, 'LineBotStack', stackProps);
