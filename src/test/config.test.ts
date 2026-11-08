import { describe, expect, it } from "vitest";
import { validateConfigValue } from "@/lib/config";

describe("configuration value validation", () => {
  it("rejects empty and whitespace-only values", () => {
    expect(validateConfigValue("")).toBe("Informe um valor para a configuração.");
    expect(validateConfigValue("   ")).toBe("Informe um valor para a configuração.");
  });

  it("rejects values longer than 500 characters", () => {
    expect(validateConfigValue("x".repeat(501))).toBe("O valor deve ter no máximo 500 caracteres.");
  });

  it("accepts non-empty values within the limit", () => {
    expect(validateConfigValue("  100  ")).toBeNull();
    expect(validateConfigValue("https://example.test")).toBeNull();
  });
});
