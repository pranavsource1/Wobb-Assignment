import type { Platform, UserProfileSummary } from "@/types";
import { SearchX } from "lucide-react";
import { ProfileCard } from "./ProfileCard";

interface Props {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({ profiles, platform }: Props) {
  if (profiles.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <SearchX size={42} />
          <h3>No profiles found</h3>
          <p>Try a different creator name, username, or platform.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      {profiles.map((profile) => (
        <ProfileCard key={profile.user_id} profile={profile} platform={platform} />
      ))}
    </div>
  );
}
