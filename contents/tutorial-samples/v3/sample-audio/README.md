# sample-audio-v3

**sample-audio-v3** は JavaScript で Akashic のゲームを作る際のサンプルプロジェクトです。

## 利用方法

`sample-audio-v3` を利用するには Node.js が必要です。

初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `sample-audio-v3` を新しく生成するごとに必要です。

```sh
npm install
```

### 動作確認方法

以下のどちらかを実行後、ブラウザで `http://localhost:3000/game/` にアクセスすることでゲームを実行できます。

- `npm start`

- `npm install -g @akashic/akashic-sandbox` 後、 `akashic-sandbox .`

### テンプレートの使い方

#### javascript

- `script/main.js` を編集することでサンプルプロジェクトの改変が可能です。

### アセットの更新方法

各種アセットを追加したい場合は、それぞれのアセットファイルを以下のディレクトリに格納します。

- 画像アセット: `image`
- スクリプトアセット: `script`
- テキストアセット: `text`
- オーディオアセット: `audio`

これらのアセットを追加・変更したあとに `akashic scan asset` をすると、アセットの変更内容をもとに `game.json` を書き換えることができます。

### npm モジュールの追加・削除

`sample-audio-v3` で npm モジュールを利用する場合、このディレクトリで `akashic install <package_name>` することで npm モジュールを追加することができます。

また `akashic uninstall <package_name>` すると npm モジュールを削除することができます。

## エクスポート方法

`javascript-game-sample` をエクスポートするときは以下のコマンドを利用します。

### html ファイルのエクスポート

`akashic export html -o game` のコマンドを利用することで `game` ディレクトリにエクスポートすることができます。

`game/index.html` をブラウザで開くと単体動作させることができます。

### zip ファイルのエクスポート

`akashic export zip -o game.zip` のコマンドを利用することで `game.zip` という名前の zip ファイルを出力できます。

## テスト方法

以下のコマンドで [ESLint](https://github.com/eslint/eslint "ESLint")を使った Lint が実行されます。
スクリプトアセット内に ES5 構文に反する記述がある場合エラーを返します。

```sh
npm run lint
```
