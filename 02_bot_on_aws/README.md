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

### ブートストラッピング

初回のみ実行する必要がある。
[AWS CDK の開始方法](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html)

```bash
cdk bootstrap aws://{ACCOUNT-NUMBER}/{REGION}
```

- ACCOUNT-NUMBER
    - 各自のAWSアカウントに付与された番号
- REGION
    - 今回は東京リージョン ( `ap-northeast-1` )を利用する
