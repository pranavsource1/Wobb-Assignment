import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search } from "lucide-react";

interface Props { selected: Platform; onChange: (p: Platform) => void; searchQuery: string; onSearchChange: (v: string) => void; }

const platformInitials: Record<Platform, string> = {
  instagram: "IG",
  youtube: "YT",
  tiktok: "TT",
};

export function PlatformFilter({ selected, onChange, searchQuery, onSearchChange }: Props) {
  return (
    <div className="filter-panel">
      <div className="platform-tabs" role="tablist" aria-label="Choose platform">
        {PLATFORMS.map((p) => (
          <button 
            key={p} 
            type="button"
            role="tab" 
            aria-selected={selected === p} 
            onClick={() => onChange(p)} 
            className={`platform-tab ${selected === p ? "active" : ""}`}
          >
            <span className="platform-icon" aria-hidden="true">{platformInitials[p]}</span>
            <span>{getPlatformLabel(p)}</span>
          </button>
        ))}
      </div>

      <label className="search-field">
        <Search size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or creator name"
          aria-label="Search influencers"
        />
      </label>
    </div>
  );
}
