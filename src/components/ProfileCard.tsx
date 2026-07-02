import { memo, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Platform, UserProfileSummary } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { VerifiedBadge } from "./VerifiedBadge";
import { Check, Plus, Instagram, Youtube, Music } from "lucide-react";

interface Props { profile: UserProfileSummary; platform: Platform; }

const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'instagram': return <Instagram size={14} />;
    case 'youtube': return <Youtube size={14} />;
    case 'tiktok': return <Music size={14} />;
  }
};

export const ProfileCard = memo(function ProfileCard({ profile, platform }: Props) {
  const navigate = useNavigate();
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isInList = useListStore((s) => s.isInList);
  const inList = isInList(profile.user_id);
  const handle = profile.username || profile.handle || profile.user_id;

  const handleClick = useCallback(() => navigate(`/profile/${handle}?platform=${platform}`), [navigate, handle, platform]);

  const handleToggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (inList) { removeProfile(profile.user_id); toast.success(`Removed ${profile.fullname}`); }
    else { const ok = addProfile(profile, platform); if (ok) toast.success(`Added ${profile.fullname}`); else toast.error("Already in list"); }
  }, [inList, profile, platform, addProfile, removeProfile]);

  const handleCardKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      className="creator-card"
      aria-label={`${profile.fullname} profile`}
    >
      <div className="flex items-start justify-between gap-4">
        <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" className="avatar-ring w-[68px] h-[68px] rounded-full object-cover" />
        <div className="platform-chip">
          {getPlatformIcon(platform)}
          <span>{getPlatformLabel(platform)}</span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 truncate text-xl font-extrabold text-off-white">{profile.fullname}</h3>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-muted-white">@{handle}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="card-stat">
          <strong className="block truncate text-sm font-extrabold text-off-white">{formatFollowers(profile.followers)}</strong>
          <span className="mt-1 block text-xs font-semibold text-light-blue/65">Followers</span>
        </div>
        <div className="card-stat">
          <strong className="block truncate text-sm font-extrabold text-off-white">{formatEngagementRate(profile.engagement_rate)}</strong>
          <span className="mt-1 block text-xs font-semibold text-light-blue/65">Engage</span>
        </div>
        <div className="card-stat">
          <strong className="block truncate text-sm font-extrabold text-off-white">{formatFollowers(profile.engagements ?? profile.avg_views ?? 0)}</strong>
          <span className="mt-1 block text-xs font-semibold text-light-blue/65">{profile.engagements ? "Actions" : "Views"}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`${inList ? "button-secondary" : "button-primary"} w-full`}
        aria-label={inList ? "Remove from list" : "Add to list"}
      >
        {inList ? <><Check size={16} /><span>Saved</span></> : <><Plus size={16} /><span>Add to List</span></>}
      </button>
    </article>
  );
});
