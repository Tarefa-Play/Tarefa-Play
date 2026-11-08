import { describe, expect, it } from "vitest";
import { primaryRole, rolePath } from "@/lib/auth";

describe("role routing", () => {
  it("selects the only assigned role", () => {
    expect(primaryRole(["validador"])).toBe("validador");
    expect(primaryRole(["anunciante"])).toBe("anunciante");
  });

  it("uses the documented priority when multiple roles exist", () => {
    expect(primaryRole(["validador", "anunciante"])).toBe("anunciante");
    expect(primaryRole(["admin", "anunciante", "validador"])).toBe("admin");
  });

  it("sends users without a role to login", () => {
    expect(primaryRole([])).toBeNull();
    expect(rolePath(null)).toBe("/entrar");
  });

  it.each([
    ["validador", "/validador"],
    ["anunciante", "/anunciante"],
    ["admin", "/admin"],
  ] as const)("maps %s to its own protected area", (role, path) => {
    expect(rolePath(role)).toBe(path);
  });
});
