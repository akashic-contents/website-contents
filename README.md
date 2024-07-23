# website-contents

[Akashic 公式サイト][akashic-website] 用のコンテンツ置き場です。
[最新のリリース][release-latest] または [リリースページ][releases] からコンテンツの zip ファイルをダウンロードできます。

## release

PullRequest を作成後 `release` ラベルを付与してください。
対象の PullRequest が main ブランチにマージされるとリリースが実行されます。

## generate

次のコマンドを実行することで `./dist` ディレクトリと `./public` ディレクトリを生成します。

- `./dist` ディレクトリには `./contents/tutorial-sample` 以下の `game.json` を含むゲームコンテンツの zip ファイルが出力されます。

- `./public` ディレクトリには `./contents` 以下の `game.json` を自動で検出し、実行可能な形態 (`./node_modules` などを含む) のファイル群が出力されます。

```sh
npm run generate
```

## test

次のコマンドでテストを実行します。

```sh
npm test
```

[akashic-website]: https://akashic-games.github.io/
[release-latest]: https://github.com/akashic-contents/website-contents/releases/latest
[releases]: https://github.com/akashic-contents/website-contents/releases
