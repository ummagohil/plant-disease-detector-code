import { describe, it, expect, vi } from "vitest";

let mockGenerateContent: any;

vi.mock("@google/genai", () => {
  mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

describe("analyzePlantImage", () => {
  it("throws error if API_KEY is not set", async () => {
    const { analyzePlantImage } = await import("./geminiService");
    const originalEnv = process.env.API_KEY;
    process.env.API_KEY = "";
    await expect(analyzePlantImage("base64", "image/png")).rejects.toThrow(
      /API_KEY/
    );
    process.env.API_KEY = originalEnv;
  });

  it("returns text from API on success", async () => {
    const { analyzePlantImage } = await import("./geminiService");
    mockGenerateContent.mockResolvedValueOnce({ text: "Plant is healthy." });
    process.env.API_KEY = "test";
    const result = await analyzePlantImage("base64", "image/png");
    expect(result).toBe("Plant is healthy.");
  });
});
