import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch, buildUrl, getBaseApiUrl } from "../service/api";

describe("api helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usa URL por defecto cuando no existe NEXT_PUBLIC_API_URL", () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getBaseApiUrl()).toBe("https://fakestoreapi.com");
    expect(buildUrl("/products")).toBe("https://fakestoreapi.com/products");
  });

  it("respeta endpoints absolutos", () => {
    expect(buildUrl("https://example.com/products")).toBe(
      "https://example.com/products",
    );
  });

  it("lanza error detallado cuando la respuesta no es OK", async () => {
    const mockedFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      headers: {
        get: () => "application/json",
      },
      json: async () => ({ message: "Fallo interno" }),
      text: async () => "",
    });

    vi.stubGlobal("fetch", mockedFetch);

    await expect(apiFetch("/products")).rejects.toThrow("Error 500: Fallo interno");
  });
});
