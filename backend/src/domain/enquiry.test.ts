import { describe, expect, it } from "vitest";
import { parseEnquiry } from "./enquiry.js";

describe("parseEnquiry", () => {
  it("accepts a valid enquiry", () => {
    const result = parseEnquiry({
      productId: 3,
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "0400000000",
      message: "Do you have this in store?"
    });
    expect(result.productId).toBe(3);
  });

  it("rejects an invalid email", () => {
    expect(() =>
      parseEnquiry({
        productId: 3,
        name: "Ada",
        email: "not-an-email",
        message: "Hello"
      })
    ).toThrow();
  });

  it("rejects missing fields", () => {
    expect(() => parseEnquiry({ productId: 1, email: "a@b.com" })).toThrow();
  });
});
