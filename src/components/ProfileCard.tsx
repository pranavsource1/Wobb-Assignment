import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Platform, UserProfileSummary } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { VerifiedBadge } from "./VerifiedBadge";
import { Check, Plus } from "lucide-react";

interface Props { profile: UserProfileSummary; platform: Platform; }

export const ProfileCard = memo(function ProfileCard({ profile, platform }: Props) {
  const navigate = useNavigate();
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isInList = useListStore((s) => s.isInList);
  const inList = isInList(profile.user_id);
  const handle = profile.username || profile.handle || profile.user_id;

  const handleClick = useCallback(() => navigate(`/profile/${handle}?platform=${platform}`), [navigate, handle, platform]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inList) { removeProfile(profile.user_id); toast.success(`Removed ${profile.fullname}`); }
    else { const ok = addProfile(profile, platform); if (ok) toast.success(`Added ${profile.fullname}`); else toast.error("Already in list"); }
  }, [inList, profile, platform, addProfile, removeProfile]);

  return (
    <div 
      onClick={handleClick} 
      className={`profile-card platform-${platform}`}
      role="article" 
      aria-label={`${profile.fullname} profile`}
    >
      <div className="profile-top">
        <div className="avatar-wrap">
          <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" />
        </div>
        <span className="platform-pill">{getPlatformLabel(platform)}</span>
      </div>

      <div>
        <div className="profile-name-row">
          <h3 className="profile-name">{profile.fullname}</h3>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="profile-handle">@{handle}</p>
      </div>

      <div className="profile-metrics">
        <div className="metric">
          <strong>{formatFollowers(profile.followers)}</strong>
          <span>Followers</span>
        </div>
        <div className="metric">
          <strong>{formatEngagementRate(profile.engagement_rate)}</strong>
          <span>Engage</span>
        </div>
        <div className="metric">
          <strong>{formatFollowers(profile.engagements ?? profile.avg_views ?? 0)}</strong>
          <span>{profile.engagements ? "Actions" : "Views"}</span>
        </div>
      </div>

      <button 
        type="button"
        onClick={handleToggle} 
        className={`save-button ${inList ? "saved" : ""}`}
        aria-label={inList ? "Remove from list" : "Add to list"}
      >
        {inList ? <><Check size={16} /><span>Saved</span></> : <><Plus size={16} /><span>Add to List</span></>}
      </button>
    </div>
  );
});
