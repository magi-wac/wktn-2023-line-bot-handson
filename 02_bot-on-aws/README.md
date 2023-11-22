# Bot を AWS で稼働させる

## 利用する AWS サービス

| サービス | 概要 | 本 Bot で利用する内容 |
| ---- | ---- | ---- |
| AWS Lambda | Runtime | Bot アプリケーションの実行環境 (Node.js v18) |
| DynamoDB | NoSQL Database | Bot での会話記録の保存 |
| S3 | オブジェクトストレージ | Bot へ送信した画像ファイルなどを格納先 |

## AWS へのデプロイ方法

### AWS CDK (xxx)

AWS 謹製の IaC ツール
プログラムのコードで AWS のサービス構成（インフラ）の定義を記載でき、AWS 環境へデプロイできる。
今回は JavaScript を使用して構成を定義する。

## CDK 実行用グループ・ユーザーを作る

### IAM

グループとユーザーを作成し、ユーザーの AccessKey.csv をダウンロードする。

### 認証情報の設定を開発用コンテナーに登録する

AccessKey.csv にある認証情報を登録する。

```csv
Access key ID,Secret access key
XXXXXXXXXX, YYYYY1234567890ZZZZZZZ
```

```bash
aws configure
```

プロンプトが表示されたら、AWSアクセスキー、シークレットアクセスキー、デフォルトのリージョンを入力します。

```bash
$ aws configure
AWS Access Key ID [None]: XXXXXXXXXX
AWS Secret Access Key [None]: YYYYY1234567890ZZZZZZZ
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

下記コマンドを実行して、設定した値が登録されていればOK。

```bash
$ cat ~/.aws/config
[default]
region = ap-northeast-1
output = json

$ cat ~/.aws/credentials 
[default]
aws_access_key_id = XXXXXXXXXX
aws_secret_access_key = YYYYY1234567890ZZZZZZZ
```

### ブートストラッピング（初回のみ）

CDK を利用する際、アカウントで初回のみ実行する必要がある。
[AWS CDK の開始方法](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html)

```bash
cdk bootstrap aws://{ACCOUNT-NUMBER}/{REGION}
```

- ACCOUNT-NUMBER
    - 各自のAWSアカウントに付与された番号
- REGION
    - 今回は東京リージョン ( `ap-northeast-1` )を利用する

```bash
$ cdk bootstrap aws://123456789012/ap-northeast-1
 ⏳  Bootstrapping environment aws://123456789012/ap-northeast-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://123456789012/ap-northeast-1 bootstrapped.
```

## テーブル構造

### LineBotMessageLogs

LINE Bot でのメッセージ履歴

| 項目 | Key | Type | 説明 |
| ---- | ---- | ---- | ---- |
| senderId | PK | String | メッセージ送信者の LINE USER ID（接頭辞: `LINE_` |
| sentAt | SK | Number | メッセージ送信日時（UNIX Timestamp ミリ秒単位） |
| senderType | | String | `LINE` のみ |
| messageId | | String | メッセージID |
| messageType | | String | メッセージ種別 |
| messageText | | String | メッセージ内容（TextMessage のみ） |
| messageContents | | String | メッセージ内容の保存先（ImageMessage のみ） |

---

## Welcome to your CDK JavaScript project

This is a blank project for CDK development with JavaScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

* `npm run test`         perform the jest unit tests
* `npx cdk deploy`       deploy this stack to your default AWS account/region
* `npx cdk diff`         compare deployed stack with current state
* `npx cdk synth`        emits the synthesized CloudFormation template
