import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

export default async function fetchWordInfo(
  word: string,
  openai: OpenAI,
): Promise<string> {
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

    return formattedText;
  } catch (err) {
    console.error("WordInfoの解析に失敗しました:", err);
    return "単語情報の取得に失敗しました。";
  }
}
