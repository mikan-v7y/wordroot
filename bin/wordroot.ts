#!/usr/bin/env node
import fetchWordInfo from "../src/fetchWordInfo.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

async function main(): Promise<void> {
  const word: string | undefined = process.argv[2];

  if (!word) {
    console.error("英単語を入力してください。例: npx wordroot apple");
    process.exit(1);
  }

  if (!/^[a-zA-Z]+$/.test(word)) {
    console.error("英単語のみ入力可能です。例: apple");
    process.exit(1);
  }

  try {
    console.log(`${word} の意味と語源を検索中...\n`);
    const result: string = await fetchWordInfo(word);
    console.log(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("エラーが発生しました:", error.message);
    } else {
      console.error("不明なエラーが発生しました。");
    }
    process.exit(1);
  }
}

main();
