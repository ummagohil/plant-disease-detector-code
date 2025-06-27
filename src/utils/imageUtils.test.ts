import { describe, it, expect, vi } from "vitest";
import { fileToBase64 } from "./imageUtils";

describe("fileToBase64", () => {
  it("resolves with base64 data when file is read", async () => {
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const base64 = "ZmFrZSBiYXNlNjQ=";
    const mockReadAsDataURL = vi.fn();
    const mockFileReader = {
      readAsDataURL: mockReadAsDataURL,
      onload: undefined as unknown as null | (() => void),
      onerror: undefined as unknown as null | ((error: any) => void),
      result: `data:image/png;base64,${base64}`,
    };
    vi.stubGlobal("FileReader", function () {
      return mockFileReader;
    });
    const promise = fileToBase64(file);
    // Simulate load
    (mockFileReader.onload as () => void)?.();
    await expect(promise).resolves.toBe(base64);
  });

  it("rejects if base64 data is missing", async () => {
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: undefined as unknown as null | (() => void),
      onerror: undefined as unknown as null | ((error: any) => void),
      result: "data:image/png;base64,",
    };
    vi.stubGlobal("FileReader", function () {
      return mockFileReader;
    });
    const promise = fileToBase64(file);
    (mockFileReader.onload as () => void)?.();
    await expect(promise).rejects.toThrow(/Failed to extract base64/);
  });

  it("rejects on FileReader error", async () => {
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: undefined as unknown as null | (() => void),
      onerror: undefined as unknown as null | ((error: any) => void),
      result: null,
    };
    vi.stubGlobal("FileReader", function () {
      return mockFileReader;
    });
    const promise = fileToBase64(file);
    // Simulate error
    (mockFileReader.onerror as (error: any) => void)?.("error");
    await expect(promise).rejects.toThrow(/Failed to read file/);
  });
});
