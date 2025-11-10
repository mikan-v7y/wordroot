import fetchWordInfo from "../src/fetchWordInfo";
import OpenAI from "openai";

jest.mock("openai");

const mockCreate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
    apiKey: process.env.OPENAI_API_KEY_TEST,
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe("fetchWordInfo", () => {
  test("OpenAI APIキーが設定されていない場合、エラーを返す", async () => {
    delete process.env.OPENAI_API_KEY_TEST;

    await expect(fetchWordInfo("fjord")).rejects.toThrow(
      "OpenAIのAPIキーが設定されていません。.envファイルを確認してください。",
    );
  });

  test("AIから正常な応答を取得できた場合、空行を削除し、整形された文字列を返す", async () => {
    process.env.OPENAI_API_KEY_TEST = "dummy";

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content:
              "意味: フィヨルドは氷河によって形成された入り江。\n\n語源: ノルウェー語 fjord（フィヨール）から来ており、もとは古ノルド語 fjörðr に由来します。",
          },
        },
      ],
    });

    const result = await fetchWordInfo("fjord");

    expect(result).toBe(
      "意味: フィヨルドは氷河によって形成された入り江。\n語源: ノルウェー語 fjord（フィヨール）から来ており、もとは古ノルド語 fjörðr に由来します。",
    );
  });

  test("AIの応答が空の場合、エラーを返す", async () => {
    process.env.OPENAI_API_KEY_TEST = "dummy_key";

    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    await expect(fetchWordInfo("fjord")).rejects.toThrow(
      "AIからの応答を取得できませんでした。",
    );
  });
});
