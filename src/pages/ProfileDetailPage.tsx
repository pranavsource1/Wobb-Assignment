import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Check, ExternalLink, Plus, UserX, Instagram, Youtube, Music } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProfileDetailSkeleton } from "@/components/Skeleton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";

interface StatProps {
  label: string;
  value: string;
}

interface DetailState {
  username: string | null;
  data: ProfileDetailResponse | null;
}

const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'instagram': return <Instagram size={14} />;
    case 'youtube': return <Youtube size={14} />;
    case 'tiktok': return <Music size={14} />;
  }
};

function StatCard({ label, value }: StatProps) {
  return (
    <div className="metric-tile h-full">
      <div className="text-xs font-bold uppercase text-light-blue/65">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-off-white">{value}</div>
    </div>
  );
}

function getPlatform(value: string | null): Platform {
  if (value === "youtube" || value === "tiktok" || value === "instagram") return value;
  return "instagram";
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = getPlatform(searchParams.get("platform"));
  const [detailState, setDetailState] = useState<DetailState>({ username: null, data: null });
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isInList = useListStore((s) => s.isInList);

  useEffect(() => {
    if (!username) return;
    let active = true;
    loadProfileByUsername(username).then((detail) => {
      if (active) setDetailState({ username, data: detail });
    });
    return () => {
      active = false;
    };
  }, [username]);

  const loaded = detailState.username === username;
  const data = loaded ? detailState.data : null;

  const handleToggle = useCallback(() => {
    if (!data) return;
    const user = data.data.user_profile;
    if (isInList(user.user_id)) {
      removeProfile(user.user_id);
      toast.success(`Removed ${user.fullname}`);
      return;
    }

    const ok = addProfile({
      user_id: user.user_id,
      username: user.username,
      url: user.url,
      picture: user.picture,
      fullname: user.fullname,
      is_verified: user.is_verified,
      followers: user.followers,
      engagements: user.engagements,
      engagement_rate: user.engagement_rate,
      handle: user.handle,
      avg_views: user.avg_views,
    }, platform);
    if (ok) toast.success(`Added ${user.fullname}`);
    else toast.error("Already in list");
  }, [data, platform, addProfile, removeProfile, isInList]);

  if (!username) {
    return (
      <Layout>
        <EmptyDetail title="Invalid profile" />
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <ProfileDetailSkeleton />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <EmptyDetail title="Profile not found" />
      </Layout>
    );
  }

  const user: FullUserProfile = data.data.user_profile;
  const handle = user.username || user.handle || user.user_id;
  const inList = isInList(user.user_id);
  const stats: StatProps[] = [
    { label: "Followers", value: formatFollowers(user.followers) },
    { label: "Engagement Rate", value: formatEngagementRate(user.engagement_rate) },
  ];
  if (user.posts_count !== undefined) stats.push({ label: "Posts", value: user.posts_count.toLocaleString() });
  if (user.avg_likes !== undefined) stats.push({ label: "Avg Likes", value: formatFollowers(user.avg_likes) });
  if (user.avg_comments !== undefined) stats.push({ label: "Avg Comments", value: formatFollowers(user.avg_comments) });
  if (user.avg_views !== undefined && user.avg_views > 0) stats.push({ label: "Avg Views", value: formatFollowers(user.avg_views) });
  if (user.avg_reels_plays !== undefined && user.avg_reels_plays > 0) stats.push({ label: "Avg Reels Plays", value: formatFollowers(user.avg_reels_plays) });
  if (user.engagements !== undefined) stats.push({ label: "Engagements", value: formatFollowers(user.engagements) });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <Link to="/" className="button-ghost w-fit">
            <ArrowLeft size={18} />
            Back to search
          </Link>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby="profile-title"
        >
          <div className="profile-hero mb-7 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
              <img src={user.picture} alt={`${user.fullname} avatar`} className="avatar-ring w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto lg:mx-0" />

              <div className="min-w-0 text-center lg:text-left">
                <div className="platform-chip mb-4 mx-auto lg:mx-0">
                  {getPlatformIcon(platform)}
                  <span>{getPlatformLabel(platform)}</span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <h1 id="profile-title" className="min-w-0 text-3xl md:text-4xl font-extrabold text-off-white leading-tight">{user.fullname}</h1>
                  <VerifiedBadge verified={user.is_verified} />
                </div>

                <p className="mt-2 text-lg text-muted-white font-semibold">@{handle}</p>

                {user.description && (
                  <p className="mt-5 text-sm sm:text-base text-muted-white leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {user.description}
                  </p>
                )}

                <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`${inList ? "button-secondary" : "button-primary"} w-full sm:w-auto`}
                  >
                    {inList ? <><Check size={18} /> Saved</> : <><Plus size={18} /> Add to List</>}
                  </button>
                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-ghost w-full sm:w-auto"
                    >
                      <ExternalLink size={18} />
                      View Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="h-full"
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}

function EmptyDetail({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="surface-panel rounded-cards p-8 sm:p-10 max-w-md w-full flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-5">
          <UserX size={34} className="text-light-blue/60" />
        </div>
        <h3 className="text-2xl font-extrabold text-off-white mb-3">{title}</h3>
        <p className="text-muted-white leading-relaxed mb-7">The selected creator does not have a detail profile in the local data.</p>
        <Link to="/" className="button-ghost">
          <ArrowLeft size={18} />
          Back to search
        </Link>
      </div>
    </div>
  );
}
