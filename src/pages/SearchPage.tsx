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
      <section className="space-y-7 sm:space-y-8" aria-labelledby="discover-title">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="surface-panel rounded-cards p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="soft-chip mb-3 text-accent-mint">{getPlatformLabel(platform)} pool</div>
                  <h1 id="discover-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-off-white leading-tight">
                    Creator Discovery
                  </h1>
                  <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-white leading-relaxed">
                    Curated reach, engagement, and profile signals for fast shortlisting.
                  </p>
                </div>

                <div className="soft-chip self-start md:self-auto text-accent-gold">
                  {filtered.length} visible
                </div>
              </div>

              <PlatformFilter
                selected={platform}
                onChange={(p) => {
                  setPlatform(p);
                  setSearchQuery("");
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <div className="stat-strip" aria-label="Current platform summary">
                <div className="metric-tile">
                  <span className="text-xs font-bold uppercase text-light-blue/65">Total reach</span>
                  <strong className="mt-2 block text-2xl font-extrabold text-off-white">{formatFollowers(totalFollowers)}</strong>
                </div>
                <div className="metric-tile">
                  <span className="text-xs font-bold uppercase text-light-blue/65">Profiles</span>
                  <strong className="mt-2 block text-2xl font-extrabold text-off-white">{allProfiles.length}</strong>
                </div>
                <div className="metric-tile">
                  <span className="text-xs font-bold uppercase text-light-blue/65">Avg engagement</span>
                  <strong className="mt-2 block text-2xl font-extrabold text-off-white">{formatEngagementRate(avgEngagement)}</strong>
                </div>
              </div>
            </div>
          </div>

          <aside className="surface-panel rounded-cards p-5 sm:p-6" aria-label="Top creators">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-glass">
              <div>
                <h2 className="text-lg font-extrabold text-off-white">Top creators</h2>
                <p className="mt-1 text-sm text-muted-white">{getPlatformLabel(platform)}</p>
              </div>
              <span className="soft-chip text-accent-mint">Top 3</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {spotlight.map((profile, index) => {
                const handle = profile.username || profile.handle || profile.user_id;
                return (
                  <div className="drawer-item flex items-center gap-3 p-3" key={profile.user_id}>
                    <span className="w-7 h-7 rounded-full bg-accent-mint text-primary-dark text-xs font-extrabold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" className="avatar-ring w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-off-white truncate">{profile.fullname}</div>
                      <div className="mt-1 text-xs text-muted-white truncate">@{handle} / {formatFollowers(profile.followers)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        <section aria-labelledby="results-title" className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="results-title" className="text-2xl font-extrabold text-off-white">Creator results</h2>
              <p className="mt-1 text-sm text-muted-white">
                Showing {filtered.length} of {allProfiles.length} {getPlatformLabel(platform)} profiles
              </p>
            </div>
            {debouncedQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="button-ghost w-full sm:w-auto">
                Clear search
              </button>
            )}
          </div>

          <ProfileList profiles={filtered} platform={platform} />
        </section>
      </section>
    </Layout>
  );
}
