# Wordroot

英単語の意味と語源をターミナル上で簡単に調べられる CLI ツールです。

![Wordroot の実行例](https://raw.githubusercontent.com/mikan-v7y/wordroot/wordroot-ts/usage-video.gif)

## 使用方法

1. `.env` ファイルを作成します:

```bash
$ touch .env
```

2. OpenAI の API キーを設定します:

```env
OPENAI_API_KEY='あなたのAPIキー'
```

3. CLI を実行します:

```bash
$ npx @mikan-v7y/wordroot company
```

```bash
意味: 会社、団体、仲間、同行者など、人々の集まりやビジネスを指す言葉。
語源: ラテン語の「companio」（共に食事をする人）から派生し、「com-」（共に）と「panis」（パン）から成り立っています。
```
