import { describe, it, expect } from "vitest";
import { formatLabelPercentage } from "./pie.helpers";

describe("formatLabelPercentage", () => {
  it("should return the correct percentage and font size", () => {
    expect(formatLabelPercentage(0.5)).toBeNull();
    expect(formatLabelPercentage(2)).toEqual({
      percentage: 2,
      fontSize: "4px",
    });
    expect(formatLabelPercentage(3)).toEqual({
      percentage: 3,
      fontSize: "5px",
    });
    expect(formatLabelPercentage(5)).toEqual({
      percentage: 5,
      fontSize: "6px",
    });
    expect(formatLabelPercentage(7)).toEqual({
      percentage: 7,
      fontSize: "7px",
    });
    expect(formatLabelPercentage(10)).toEqual({
      percentage: 10,
      fontSize: "8px",
    });
  });
});
