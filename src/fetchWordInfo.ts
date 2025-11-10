import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export default async function fetchWordInfo(word: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!openai.apiKey) {
    throw new Error(
      "OpenAIのAPIキーが設定されていません。.envファイルを確認してください。",
    );
  }

  const prompt = `
次の英単語の「意味」と「語源」を日本語で簡潔に説明してください。
フォーマット:
意味: ...
語源: ...

英単語: ${word}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const message = response.choices[0]?.message?.content?.trim();

  if (!message) {
    throw new Error("AIからの応答を取得できませんでした。");
  }

  const formattedText = message.replace(/\n\s*\n語源:/, "\n語源:");

  return formattedText;
}
