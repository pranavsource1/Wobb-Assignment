import { describe, it, expect } from "vitest";
import { filterProfiles } from "../utils/dataHelpers";
import { formatFollowers, formatEngagementRate } from "../utils/formatters";
import type { UserProfileSummary } from "../types";

const profiles: UserProfileSummary[] = [
  {
    user_id: "1",
    username: "mrbeast",
    url: "",
    picture: "",
    fullname: "MrBeast",
    is_verified: true,
    followers: 100000000,
  },
  {
    user_id: "2",
    username: "cristiano",
    url: "",
    picture: "",
    fullname: "Cristiano Ronaldo",
    is_verified: true,
    followers: 600000000,
  },
  {
    user_id: "3",
    username: "leomessi",
    url: "",
    picture: "",
    fullname: "Leo Messi",
    is_verified: true,
    followers: 500000000,
  },
];

describe("filterProfiles", () => {
  it("should return all profiles when query is empty", () => {
    expect(filterProfiles(profiles, "")).toHaveLength(3);
  });

  it("should filter by username (case-insensitive)", () => {
    // This was the original bug — uppercase query didn't match lowercase username
    const result = filterProfiles(profiles, "MR");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("mrbeast");
  });

  it("should filter by fullname (case-insensitive)", () => {
    const result = filterProfiles(profiles, "ronaldo");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("cristiano");
  });

  it("should match partial username", () => {
    const result = filterProfiles(profiles, "beast");
    expect(result).toHaveLength(1);
  });

  it("should return empty when no match", () => {
    const result = filterProfiles(profiles, "xyz123");
    expect(result).toHaveLength(0);
  });

  it("should match by either username or fullname", () => {
    const result = filterProfiles(profiles, "leo");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("leomessi");
  });
});

describe("formatFollowers", () => {
  it("should format millions", () => {
    expect(formatFollowers(1000000)).toBe("1.0M");
    expect(formatFollowers(5500000)).toBe("5.5M");
  });

  it("should format thousands", () => {
    expect(formatFollowers(1000)).toBe("1.0K");
    expect(formatFollowers(50000)).toBe("50.0K");
  });

  it("should return raw number for less than 1000", () => {
    expect(formatFollowers(999)).toBe("999");
    expect(formatFollowers(0)).toBe("0");
  });
});

describe("formatEngagementRate", () => {
  it("should format rate correctly (rate * 100)", () => {
    // The original bug used rate * 10000, which was 100× off
    expect(formatEngagementRate(0.05)).toBe("5.00%");
    expect(formatEngagementRate(0.012551)).toBe("1.26%");
  });

  it('should return N/A for undefined', () => {
    expect(formatEngagementRate(undefined)).toBe("N/A");
  });
});
