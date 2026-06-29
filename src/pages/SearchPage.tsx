import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles, getPlatformLabel } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 250);
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, debouncedQuery), [allProfiles, debouncedQuery]);
  const spotlight = useMemo(() => allProfiles.slice(0, 3), [allProfiles]);
  const totalFollowers = useMemo(
    () => allProfiles.reduce((sum, profile) => sum + profile.followers, 0),
    [allProfiles]
  );
  const avgEngagement = useMemo(() => {
    const rates = allProfiles
      .map((profile) => profile.engagement_rate)
      .filter((rate): rate is number => typeof rate === "number");
    if (rates.length === 0) return undefined;
    return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  }, [allProfiles]);

  return (
    <Layout>
      <section className="discover-hero" aria-labelledby="discover-title">
        <div className="hero-copy">
          <div className="eyebrow">{getPlatformLabel(platform)} discovery</div>
          <h1 id="discover-title" className="hero-title">
            Find creators worth pitching.
          </h1>
          <p className="hero-subtitle">
            Search the leading profiles, compare reach and engagement, and build a shortlist you can export.
          </p>

          <div className="hero-stats" aria-label="Current platform summary">
            <div className="hero-stat">
              <strong>{formatFollowers(totalFollowers)}</strong>
              <span>Total reach</span>
            </div>
            <div className="hero-stat">
              <strong>{allProfiles.length}</strong>
              <span>Profiles</span>
            </div>
            <div className="hero-stat">
              <strong>{formatEngagementRate(avgEngagement)}</strong>
              <span>Avg engagement</span>
            </div>
          </div>
        </div>

        <aside className="spotlight-panel" aria-label="Top creators">
          <div className="spotlight-header">
            <h2>Top creators</h2>
            <span>{getPlatformLabel(platform)}</span>
          </div>
          <div className="spotlight-list">
            {spotlight.map((profile, index) => {
              const handle = profile.username || profile.handle || profile.user_id;
              return (
                <div className="spotlight-card" key={profile.user_id}>
                  <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" />
                  <div>
                    <div className="spotlight-rank">#{index + 1}</div>
                    <div className="spotlight-name">{profile.fullname}</div>
                    <div className="spotlight-meta">@{handle} | {formatFollowers(profile.followers)} followers</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <section aria-labelledby="results-title">
        <div className="results-bar">
          <div className="results-heading">
            <h2 id="results-title">Creator results</h2>
            <span className="results-count">
              Showing {filtered.length} of {allProfiles.length} {getPlatformLabel(platform)} profiles
            </span>
          </div>
          {debouncedQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="clear-button">
              Clear search
            </button>
          )}
        </div>

        <ProfileList profiles={filtered} platform={platform} />
      </section>
    </Layout>
  );
}
