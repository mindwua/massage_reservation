import { formatDate } from "../src/utils/date_utils.js"; // Adjust the path if necessary

describe("formatDate function", () => {
  
  test("should correctly format a valid ISO date string", () => {
    const isoDate = "2025-02-10T01:00:00.000Z";
    expect(formatDate(isoDate)).toBe("10-02-2025 01:00 AM");
  });

  test("should handle another valid ISO date string", () => {
    const isoDate = "2023-12-25T15:45:00.000Z";
    expect(formatDate(isoDate)).toBe("25-12-2023 03:45 PM");
  });

  test("should handle midnight (00:00 UTC)", () => {
    const isoDate = "2024-06-01T00:00:00.000Z";
    expect(formatDate(isoDate)).toBe("01-06-2024 12:00 AM");
  });

  test("should handle end of the year timestamp", () => {
    const isoDate = "2024-12-31T11:59:59.999Z";
    expect(formatDate(isoDate)).toBe("31-12-2024 11:59 AM");
  });

  test("should throw an error for an invalid date format", () => {
    const invalidDate = "invalid-date-string";
    expect(() => formatDate(invalidDate)).toThrow("Invalid ISO date format");
  });

  test("should throw an error for an empty string", () => {
    expect(() => formatDate("")).toThrow("Invalid ISO date format");
  });

  test("should throw an error for a null value", () => {
    expect(() => formatDate(null)).toThrow("Invalid ISO date format");
  });

  test("should throw an error for undefined input", () => {
    expect(() => formatDate(undefined)).toThrow("Invalid ISO date format");
  });

});
