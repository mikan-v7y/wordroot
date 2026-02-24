import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

dotenv.config({ quiet: true });

export default async function fetchWordInfo(word: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAIのAPIキーが設定されていません。.envファイルを確認してください。",
    );
  }

  const openai = new OpenAI({ apiKey });

  const WordInfoSchema = z.object({
    meaning: z.string(),
    etymology: z.string(),
  });

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: `次の英単語の「意味」と「語源」を日本語で簡潔に説明してください。\n英単語: ${word}`,
      },
    ],
    text: {
      format: zodTextFormat(WordInfoSchema, "word_info"),
    },
  });

  try {
    const wordInfo = WordInfoSchema.parse(response.output_parsed);

    const formattedText = `意味: ${wordInfo.meaning}\n語源: ${wordInfo.etymology}`;

    return formattedText.trim();
  } catch (err) {
    console.error("WordInfoの解析に失敗しました:", err);
    return "単語情報の取得に失敗しました。";
  }
}
