import fetchWordInfo from "../src/fetchWordInfo";
import OpenAI from "openai";

const mockParse = jest.fn();

const mockOpenAI = {
  responses: {
    parse: mockParse,
  },
} as unknown as OpenAI;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("fetchWordInfo", () => {
  test("正常に英単語情報を取得できた場合、文字列を返す", async () => {
    mockParse.mockResolvedValueOnce({
      output_parsed: {
        meaning: "フィヨルドは氷河によって形成された入り江。",
        etymology:
          "ノルウェー語 fjord から来ており、古ノルド語 fjörðr に由来。",
      },
    });

    const result = await fetchWordInfo("fjord", mockOpenAI);

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

    const result = await fetchWordInfo("fjord", mockOpenAI);

    expect(result).toBe("単語情報の取得に失敗しました。");
  });
});
