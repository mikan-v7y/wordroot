import fetchWordInfo from "../src/fetchWordInfo";
import OpenAI from "openai";

jest.mock("openai");

const mockParse = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
    responses: {
      parse: mockParse,
    },
  }));

  process.env.OPENAI_API_KEY = "dummy";
});

describe("fetchWordInfo", () => {
  test("APIキーが未設定の場合、エラーを返す", async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(fetchWordInfo("fjord")).rejects.toThrow(
      "OpenAIのAPIキーが設定されていません。.envファイルを確認してください。",
    );
  });

  test("正常に英単語情報を取得できた場合、文字列を返す", async () => {
    mockParse.mockResolvedValueOnce({
      output_parsed: {
        meaning: "フィヨルドは氷河によって形成された入り江。",
        etymology:
          "ノルウェー語 fjord から来ており、古ノルド語 fjörðr に由来。",
      },
    });

    const result = await fetchWordInfo("fjord");

    expect(result).toBe(
      "意味: フィヨルドは氷河によって形成された入り江。\n語源: ノルウェー語 fjord から来ており、古ノルド語 fjörðr に由来。",
    );
  });

  test("Zodパースに失敗した場合、エラーメッセージを返す", async () => {
    mockParse.mockResolvedValueOnce({
      output_parsed: {
        meaning: 123,
        etymology: null,
      },
    });

    const result = await fetchWordInfo("fjord");

    expect(result).toBe("単語情報の取得に失敗しました。");
  });
});
