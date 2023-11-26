# 事前準備

## 1. GitHub アカウントの作成

GitHub Codespaces を利用して開発環境を構築しますので、GitHub アカウントをお持ちでない方はアカウントを作成しておいてください。

### 参考

- [新しい GitHub アカウントへのサインアップ](https://docs.github.com/ja/get-started/signing-up-for-github/signing-up-for-a-new-github-account)
- [1分もかからない！5ステップでGitHubアカウント作成](https://reffect.co.jp/html/create_github_account_first_time/)

## 2. リポジトリのフォーク

こちらで準備したリポジトリを、自分のアカウントへコピー（フォーク）してハンズオンを行います。

### 2-1. ハンズオンで使うリポジトリページを開く

GitHub にログイン後、Web ブラウザー（Google Chrome 推奨）で下記 URL を開いてください。

- [wktn-2023-line-bot-handson](https://github.com/sumihiro3/wktn-2023-line-bot-handson)

![Fork](images/1_事前準備/2-1_OpenRepositoryPage.png)

### 2-2. リポジトリを自分のアカウントにフォークする

今後のハッカソン開発向けにプログラムを変更できるよう、リポジトリを自分のアカウントにフォーク（コピー）しておきます。

`Fork` メニューを開いて `Create a new fork` を選択する

![Fork](images/1_事前準備/2-2_ForkRepository.png)

`wktn-2023-line-bot-handson` is available` を確認して `Create Fork` を選択する

![Do fork](images/1_事前準備/2-2_DoForkRepository.png)

自分のアカウントにリポジトリがフォークされていることを確認する

![Fork done](images/1_事前準備/2-2_ForkRepositoryDone.png)

## 3. AWS アカウントの準備

本イベント用に展開されている AWS アカウントへログインできるユーザーで、AWS Console へログインしてください。

### 3-1. AWS 環境構築等で利用する IAM ユーザーの作成

LINE Bot を AWS 環境にデプロイする際に利用する IAM ユーザーを作成します。

この作業はチームで1つのユーザーを作成しますので、各チームの代表の方のみ実施してください。

#### 3-1-1. IAM 画面への遷移

AWS コンソールの左上にある検索ボックスへ `iam` と入力し、IAM 画面へ遷移する。

#### 3-1-2. ユーザーグループの作成

権限を整理するためにユーザーグループを作成します。

画面左のメニュから `ユーザーグループ` を選択する。

![Select User group](images/1_事前準備/3-1-2_SelectUserGroup.png)

ユーザーグループ名に `nit-wktn-cdk-group` を入力する。

![Input User group name](images/1_事前準備/3-1-2_InputUserGroupName.png)

許可ポリシーの `AdministratorAccess` にチェックを入れて、`グループを作成` を選択する。
![Select policy](images/1_事前準備/3-1-2_SelectRoleAndCreateUserGroup.png)

![User group created](images/1_事前準備/3-1-2_UserGroupCreated.png)

#### 3-1-3. ユーザーの作成

実行用のユーザーを作成します。

画面左のメニュから `ユーザー` を選択する。

![Select User](images/1_事前準備/3-1-3_SelectUser.png)

ユーザー名 `nit-wktn-cdk-user` を入力し、`次へ` を選択する。

![Input User name](images/1_事前準備/3-1-3_InputUserName.png)

ユーザーが属するグループに先ほど作成したグループ `nit-wktn-cdk-group` を選択する。

![Select User group](images/1_事前準備/3-1-3_SelectUserGroupForUser.png)

AWS CLI, AWS CDK を実行するためにアクセスキーを作成します。

作成したユーザーを選択し、`セキュリティ認証情報` タブから `アクセスキーを作成` を選択する。
![Create User access key](images/1_事前準備/3-1-3_CreateAccessKey.png)

ユースケース `コマンドラインインターフェイス (CLI)` を選択し、確認のチェックボックスをオンにして、`次へ` を選択する。
![Select use case](images/1_事前準備/3-1-3_SelectUseCase.png)

`アクセスキーを作成` を選択する。

![Create access key](images/1_事前準備/3-1-3_InputTagAndCreateAccessKey.png)

アクセスキーの CSV ファイルをダウンロードする。

![Select use case](images/1_事前準備/3-1-3_DownloadAccessKey.png)

ダウンロードした CSV ファイルは下記のような内容となっています。
チームでハンズオンに参加される方に CSV ファイルを共有しておいてください。

```csv
Access key ID,Secret access key
XXXXXXXXXX, YYYYY1234567890ZZZZZZZ
```

## 4. LINE Bot の設定準備

[LINE Bot の設定準備](PREPARE_LINE_BOT.md) に沿って、LINE Developers への登録と、LINE Bot の設定準備を行ってください。
