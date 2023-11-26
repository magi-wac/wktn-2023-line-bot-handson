# オウム返し Bot

## 1. LINE Developers で Messaging API Channel を作成

LINE Platform で Bot を動かすために必要となる **チャネル** を作成します。

### 1-1. LINE Developers へログイン

Web ブラウザーで [LINE Developers](https://developers.line.biz/console/) にアクセスし、コンソールにログインしてください。

![Login to LINE Developers](../docs/images/1_事前準備/4-1.LoginToLineDevelopers.png)

ログイン方法は、[LINE Bot の設定準備](../docs/PREPARE_LINE_BOT.md) を参照

### 1-2. Messaging API Channel を作成

事前準備で作成したプロバイダーを選択

![Select Provider](../docs/images/01_オウム返しBot/1-2_SelectProvider.png)

`Messaging API` を選択

![Select Messaging API](../docs/images/01_オウム返しBot/1-2_SelectMessagingApi.png)

入力項目に下記の値を入力または選択

![Input channel info](../docs/images/01_オウム返しBot/1-2_InputChannelInfo.png)

| 入力項目 | 値 |
| --- | --- |
| 会社・事業者の所在国・地域 | 日本 |
| チャネル名 | （任意：`ワッカソン・ハンズオン Bot` など） |
| チャネル説明 | （任意：`ワッカソン・ハンズオン Bot` など） |
| 大業種 | （任意：個人 など） |
| 小業種 | （任意：個人（その他） など） |
| メールアドレス | ご自身のメールアドレス（あらかじめ入力済み） |

規約同意のチェックを入れて `作成` を選択

![Create channel](../docs/images/01_オウム返しBot/1-2_CreateChannel.png)

`OK` を選択

![Confirm OK](../docs/images/01_オウム返しBot/1-2_ConfirmOK.png)

`同意する` を選択

![Agree to Terms](../docs/images/01_オウム返しBot/1-2_AgreeToTerms.png)

入力したチャネル情報が表示されれば、チャネルの作成が完了している

![Channel created](../docs/images/01_オウム返しBot/1-2_ChannelCreated.png)

## 2. Messaging API Channel の設定を Bot に反映

### 2-1. 設定ファイルを作成

codespace のターミナルで下記コマンドを実行して、プログラムの設定ファイルを作成

```bash
cd 01_parroting-bot
cp ./.env.example ./.env
```

作成された `01_parroting-bot/.env` ファイルをエディターで開いてください。

![Create dotenv](../docs/images/01_オウム返しBot/2-1_CreateDotEnv.png)

### 2-2. チャネルシークレットを設定ファイルに記載

Messaging API チャネルの **チャネルシークレット** をコピーして設定ファイルに記載する。

![Copy ChannelSecret](../docs/images/01_オウム返しBot/2-2_CopyChannelSecret.png)

### 2-3. チャネルアクセストークンの発行と設定ファイルに記載

`Messaging API設定` タブに切り替えて、**チャネルアクセストークン** を発行する。

![Generate ChannelAccessToken](../docs/images/01_オウム返しBot/2-3_GenerateChannelAccessToken.png)

**チャネルアクセストークン** をコピーして設定ファイルに記載する。

![Copy ChannelAccessToken](../docs/images/01_オウム返しBot/2-4_CopyChannelAccessToken.png)

## 3. Bot アプリケーションを起動

### 3-1. アプリケーション起動

codespace のターミナルで下記コマンドを実行して、Bot アプリケーションを起動する。

```bash
npm run start
```

`Parroting bot app listening on port 3000` と表示され、シンプルブラウザーで `Hello World!` と表示されていば起動成功です。

![Run application](../docs/images/01_オウム返しBot/3-1_RunApplication.png)
![Run application](../docs/images/01_オウム返しBot/3-1_RunApplication.png)

### 3-2. codespace の Port forwarding を設定

LINE Platform から起動した Bot アプリケーションへアクセスできるよう、Port forwarding 設定を `Public` に変更します。

`ポート` タブを表示し、`Application (3000)` を選択して右クリック、`ポート表示範囲` -> `Public` を選択

![Run application](../docs/images/01_オウム返しBot/3-2_ChangePortForwarding.png)

### 3-3. アプリケーションの URL をコピーしてチャネル設定に反映

ポートレコードのコピーボタンを押して、アプリケーションの URL をコピー

![Copy application URL](../docs/images/01_オウム返しBot/3-3_CopyCodespaceUrl.png)

チャネルの `Messaging API設定` にある `Webhook URL` に `{アプリケーションのURL}/webhook` を入力して、`更新` を選択

![Input webhook URL](../docs/images/01_オウム返しBot/3-3_ApplyWebhookUrl.png)

### 3-4. Webhook を有効化

`` をオンにして Webhook を有効化する。

![Enable webhook](../docs/images/01_オウム返しBot/3-4_EnableWebhook.png)

### 3-5. 応答設定の変更

`応答メッセージ` の `編集` を選択して、応答設定画面を開く。

![Open reply setting page](../docs/images/01_オウム返しBot/3-5_OpenReplySetting.png)

応答設定を下記のように変更する。

![Apply reply setting page](../docs/images/01_オウム返しBot/3-5_ApplyReplySetting.png)

- チャット
    - オフ
- あいさつメッセージ
    - オフ
- Webhook
    - オン
- 応答メッセージ
    - オフ

## 4. LINE アプリからテキストメッセージを送信

### 4-1. 作成した Bot と友だちになる

チャネルの `Messaging API設定` に表示されている QR コードをスキャンして友だち追加します。

![Add friend](../docs/images/01_オウム返しBot/4-1_ScanAndFriendBot.png)

### 4-2. 動作確認

Bot のトーク画面からテキストメッセージを送って、そのまま返ってくるかを確認します。

![Operation check](../docs/images/01_オウム返しBot/4-2_OperationCheck.png)
