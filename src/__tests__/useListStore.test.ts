import { describe, it, expect, beforeEach } from "vitest";
import { useListStore } from "../store/useListStore";
import type { UserProfileSummary } from "../types";

const mockProfile: UserProfileSummary = {
  user_id: "12345",
  username: "testuser",
  url: "https://instagram.com/testuser",
  picture: "https://example.com/pic.jpg",
  fullname: "Test User",
  is_verified: true,
  followers: 1000000,
  engagements: 50000,
  engagement_rate: 0.05,
};

const mockProfile2: UserProfileSummary = {
  user_id: "67890",
  username: "anotheruser",
  url: "https://instagram.com/anotheruser",
  picture: "https://example.com/pic2.jpg",
  fullname: "Another User",
  is_verified: false,
  followers: 500000,
  engagement_rate: 0.03,
};

describe("useListStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useListStore.setState({ profiles: [] });
  });

  it("should start with an empty list", () => {
    const { profiles } = useListStore.getState();
    expect(profiles).toHaveLength(0);
  });

  it("should add a profile to the list", () => {
    const { addProfile } = useListStore.getState();
    const result = addProfile(mockProfile, "instagram");

    expect(result).toBe(true);
    expect(useListStore.getState().profiles).toHaveLength(1);
    expect(useListStore.getState().profiles[0].username).toBe("testuser");
    expect(useListStore.getState().profiles[0].platform).toBe("instagram");
  });

  it("should prevent duplicate profiles (same user_id)", () => {
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    const result = addProfile(mockProfile, "instagram");

    expect(result).toBe(false);
    expect(useListStore.getState().profiles).toHaveLength(1);
  });

  it("should remove a profile from the list", () => {
    const { addProfile, removeProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    expect(useListStore.getState().profiles).toHaveLength(2);

    removeProfile("12345");
    expect(useListStore.getState().profiles).toHaveLength(1);
    expect(useListStore.getState().profiles[0].user_id).toBe("67890");
  });

  it("should check if a profile is in the list", () => {
    const { addProfile, isInList } = useListStore.getState();
    addProfile(mockProfile, "instagram");

    expect(isInList("12345")).toBe(true);
    expect(isInList("99999")).toBe(false);
  });

  it("should clear all profiles", () => {
    const { addProfile, clearList } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    expect(useListStore.getState().profiles).toHaveLength(2);

    clearList();
    expect(useListStore.getState().profiles).toHaveLength(0);
  });

  it("should reorder profiles", () => {
    const { addProfile, reorderProfiles } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    addProfile(mockProfile2, "youtube");

    // Move second profile to first position
    reorderProfiles(1, 0);

    const profiles = useListStore.getState().profiles;
    expect(profiles[0].user_id).toBe("67890");
    expect(profiles[1].user_id).toBe("12345");
  });

  it("should add timestamp when adding a profile", () => {
    const before = Date.now();
    const { addProfile } = useListStore.getState();
    addProfile(mockProfile, "instagram");
    const after = Date.now();

    const profile = useListStore.getState().profiles[0];
    expect(profile.addedAt).toBeGreaterThanOrEqual(before);
    expect(profile.addedAt).toBeLessThanOrEqual(after);
  });
});
