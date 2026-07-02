import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Download, GripVertical, Trash2, UserX, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { formatFollowers } from "@/utils/formatters";
import { useListStore, type ListProfile } from "@/store/useListStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ListDrawer({ open, onClose }: Props) {
  const profiles = useListStore((s) => s.profiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearList = useListStore((s) => s.clearList);
  const reorderProfiles = useListStore((s) => s.reorderProfiles);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    reorderProfiles(result.source.index, result.destination.index);
  }, [reorderProfiles]);

  const handleRemove = useCallback((profile: ListProfile) => {
    removeProfile(profile.user_id);
    toast.success(`Removed ${profile.fullname}`);
  }, [removeProfile]);

  const handleExport = (type: "csv" | "json") => {
    if (profiles.length === 0) return toast.error("No profiles");
    let content: string;
    let typeMime: string;
    let ext: string;

    if (type === "csv") {
      const headers = ["Username", "Full Name", "Platform", "Followers", "URL"];
      const rows = profiles.map((p) => [
        p.username || p.handle || p.user_id,
        p.fullname,
        p.platform,
        String(p.followers),
        p.url,
      ]);
      content = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
      typeMime = "text/csv";
      ext = "csv";
    } else {
      const data = profiles.map((p) => ({
        username: p.username || p.handle || p.user_id,
        fullname: p.fullname,
        platform: p.platform,
        followers: p.followers,
        url: p.url,
      }));
      content = JSON.stringify(data, null, 2);
      typeMime = "application/json";
      ext = "json";
    }

    const blob = new Blob([content], { type: typeMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `influencer-list.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${ext.toUpperCase()}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-primary-dark/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="drawer-panel fixed right-0 top-0 bottom-0 w-full max-w-md z-[101] flex flex-col"
            role="dialog"
            aria-label="Saved creator list"
            aria-modal="true"
          >
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-glass">
              <div className="flex items-center gap-3">
                <div className="brand-mark p-2.5 rounded-full">
                  <Users size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-off-white leading-tight">My List</h2>
                  <p className="text-sm text-muted-white">{profiles.length} profiles saved</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                className="button-ghost icon-button" 
                aria-label="Close saved list"
              >
                <X size={20} />
              </button>
            </div>

            {profiles.length > 0 && (
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 p-4 border-b border-glass bg-primary-dark/20">
                <button 
                  type="button" 
                  onClick={() => handleExport("csv")} 
                  className="button-ghost"
                >
                  <Download size={15} /> CSV
                </button>
                <button 
                  type="button" 
                  onClick={() => handleExport("json")} 
                  className="button-ghost"
                >
                  <Download size={15} /> JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearList();
                    toast.success("Cleared all");
                  }}
                  className="button-danger icon-button"
                  aria-label="Clear saved list"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="surface-panel p-8 rounded-cards flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-4">
                      <UserX size={34} className="text-light-blue/55" />
                    </div>
                    <h3 className="text-lg font-extrabold text-off-white">No saved creators yet</h3>
                  </div>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="drawer-list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
                        {profiles.map((profile, index) => {
                          const handle = profile.username || profile.handle || profile.user_id;
                          return (
                            <Draggable key={profile.user_id} draggableId={profile.user_id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`drawer-item flex items-center gap-3 p-3 transition-shadow ${snapshot.isDragging ? "shadow-xl ring-2 ring-accent-mint z-50" : ""}`}
                                  style={provided.draggableProps.style}
                                >
                                  <div {...provided.dragHandleProps} className="text-light-blue/45 hover:text-light-blue cursor-grab" aria-label="Reorder creator">
                                    <GripVertical size={18} />
                                  </div>
                                  <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" className="avatar-ring w-11 h-11 rounded-full object-cover" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-extrabold text-off-white truncate">{profile.fullname}</div>
                                    <div className="text-xs text-muted-white truncate">
                                      @{handle} / {getPlatformLabel(profile.platform)} / {formatFollowers(profile.followers)}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(profile)}
                                    className="button-danger icon-button"
                                    aria-label={`Remove ${profile.fullname}`}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function csvEscape(value: string) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}
