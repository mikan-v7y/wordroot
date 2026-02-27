import OpenAI from "openai";

export default function createOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error(
      "OpenAIのAPIキーが設定されていません。.envファイルを確認してください。",
    );
    process.exit(1);
  }

  return new OpenAI({ apiKey });
}
