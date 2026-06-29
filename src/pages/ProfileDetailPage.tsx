import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Check, ExternalLink, Plus, UserX } from "lucide-react";
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

function StatCard({ label, value }: StatProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
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
      <div className="detail-wrap">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to search
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="detail-panel"
          aria-labelledby="profile-title"
        >
          <div className="detail-header">
            <div className="detail-avatar">
              <img src={user.picture} alt={`${user.fullname} avatar`} />
            </div>

            <div>
              <div className="platform-pill">{getPlatformLabel(platform)}</div>
              <div className="detail-title-row" style={{ marginTop: 16 }}>
                <h1 id="profile-title" className="detail-title">{user.fullname}</h1>
                <VerifiedBadge verified={user.is_verified} />
              </div>
              <p className="detail-handle">@{handle}</p>
              {user.description && <p className="detail-description">{user.description}</p>}
            </div>

            <div className="detail-actions">
              <button
                type="button"
                onClick={handleToggle}
                className={`save-button ${inList ? "saved" : ""}`}
              >
                {inList ? <><Check size={16} /> Saved</> : <><Plus size={16} /> Add to List</>}
              </button>
              {user.url && (
                <a href={user.url} target="_blank" rel="noopener noreferrer" className="external-link">
                  <ExternalLink size={16} />
                  View Profile
                </a>
              )}
            </div>
          </div>

          <div className="detail-stats">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
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
    <div className="not-found-panel">
      <div>
        <UserX size={42} />
        <h3>{title}</h3>
        <p>The selected creator does not have a detail profile in the local data.</p>
        <Link to="/" className="back-link" style={{ marginTop: 18 }}>
          <ArrowLeft size={16} />
          Back to search
        </Link>
      </div>
    </div>
  );
}
