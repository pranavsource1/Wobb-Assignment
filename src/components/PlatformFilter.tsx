import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, Instagram, Youtube, Music } from "lucide-react";

interface Props { selected: Platform; onChange: (p: Platform) => void; searchQuery: string; onSearchChange: (v: string) => void; }

const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'instagram': return <Instagram size={16} />;
    case 'youtube': return <Youtube size={16} />;
    case 'tiktok': return <Music size={16} />;
  }
};

export function PlatformFilter({ selected, onChange, searchQuery, onSearchChange }: Props) {
  return (
    <div className="toolbar-panel w-full p-3 sm:p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
      <div className="segmented-control shrink-0" role="tablist" aria-label="Choose platform">
        {PLATFORMS.map((p) => (
          <button 
            key={p} 
            role="tab" 
            aria-selected={selected === p} 
            onClick={() => onChange(p)} 
            className={`segment-button ${selected === p ? "segment-button-active" : ""}`}
          >
            {getPlatformIcon(p)}
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>

      <div className="relative w-full">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light-blue/60 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators"
          className="search-input"
          aria-label="Search influencers"
        />
      </div>
    </div>
  );
}
