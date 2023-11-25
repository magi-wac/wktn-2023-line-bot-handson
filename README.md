# wktn-2023-line-bot-handson

## 1. 事前準備

ハンズオン参加の前に下記のアカウント等の準備を実施しておいてください。

### 1. GitHub アカウントの作成

GitHub Codespaces を利用して開発環境を構築しますので、GitHub アカウントをお持ちでない方はアカウントを作成しておいてください。

#### 参考

- [新しい GitHub アカウントへのサインアップ](https://docs.github.com/ja/get-started/signing-up-for-github/signing-up-for-a-new-github-account)
- [1分もかからない！5ステップでGitHubアカウント作成](https://reffect.co.jp/html/create_github_account_first_time/)

### 2. リポジトリのフォーク

こちらで準備したリポジトリを、自分のアカウントへコピー（フォーク）してハンズオンを行います。

#### 2-1. ハンズオンで使うリポジトリページを開く

GitHub にログイン後、Web ブラウザー（Google Chrome 推奨）で下記 URL を開いてください。

- [wktn-2023-line-bot-handson](https://github.com/sumihiro3/wktn-2023-line-bot-handson)

![Fork](docs/images/1_事前準備/2-1_OpenRepositoryPage.png)

#### 2-2. リポジトリを自分のアカウントにフォークする

今後のハッカソン開発向けにプログラムを変更できるよう、リポジトリを自分のアカウントにフォーク（コピー）しておきます。

`Fork` メニューを開いて `Create a new fork` を選択する

![Fork](docs/images/1_事前準備/2-2_ForkRepository.png)

`wktn-2023-line-bot-handson` is available` を確認して `Create Fork` を選択する

![Do fork](docs/images/1_事前準備/2-2_DoForkRepository.png)

自分のアカウントにリポジトリがフォークされていることを確認する

![Fork done](docs/images/1_事前準備/2-2_ForkRepositoryDone.png)

### 3. AWS アカウントの準備

本イベント用に展開されている AWS アカウントへログインできるユーザーで、AWS Console へログインできることを確認しておいてください。

また、IAM で `AdministratorAccess` 権限を持つユーザーを作成するので、IAM のユーザー作成画面にアクセスできることも確認しておいてください。

[ユーザー作成画面](https://us-east-1.console.aws.amazon.com/iam/home?region=ap-northeast-1#/users/create)

![IAM create User page](docs/images/1_事前準備/3-1_IamUserPage.png)

## 2. 今回のハンズオンで作成する LINE Bot

### 1. オウム返し Bot

最初に、ユーザーが送信したテキストメッセージをそのまま返す Bot を作成します。簡単に Bot アプリケーションを動かしてみましょう

- GitHub codespaces 上で動作するものを作ります

### 2. ユーザーとの会話を記録する Bot

ユーザーが送ったメッセージをデータベースに記録する Bot を作成します。
テキストメッセージと画像メッセージに対応し、画像はオンラインストレージに格納します。

- AWS 上で動作する Bot を作ります
- ユーザーとの会話履歴を記録するので、生成 AI を使って会話記録を踏まえた Bot へ拡張できます

## 3. 開発環境準備

### 1. Codespace の起動

事前準備でフォークしたリポジトリで Codespace を起動します。

フォーク元から起動すると、今後のハッカソン向けに拡張した内容をコミットできなくなるので気をつけてください。

![Fork done](docs/images/1_事前準備/2-2_ForkRepositoryDone.png)

GitHub にログインした状態で、`Code` メニューで `Codespaces` タブを開き、`Create codespace on main` を選択する。

![Launch codespaces](docs/images/3_開発環境準備/1_LaunchCodespaces.png)

### 2. Codespace のビルド

起動が開始されると Codespace の設定が実行されます。

![Setting codespace](docs/images/3_開発環境準備/2_SettingCodespaces.png)

Codespace に設定する内容は [設定ファイル](.devcontainer/devcontainer.json) と [Dockerfile](.devcontainer/Dockerfile) に記載しています。
VS Code で利用する拡張機能や環境構築のスクリプトなどを設定できるので、興味がある方はご覧ください。

今回は主に下記の設定を行っています。

- VS Code で利用する拡張機能のインストール
    - インデントを見やすくする拡張機能
        - indent-rainbow
    - コードフォーマットを行う拡張機能
        - Prettier - Code formatter
- AWS CLI, AWS CDK のインストール

## オウム返しBot

[オウム返しBotのハンズオンへ](./01_parroting-bot/README.md)
