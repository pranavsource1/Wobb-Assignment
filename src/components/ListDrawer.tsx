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
            className="drawer-overlay"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="drawer-panel"
            role="dialog"
            aria-label="Saved creator list"
            aria-modal="true"
          >
            <div className="drawer-header">
              <div className="drawer-header-title">
                <Users size={22} />
                <div>
                  <h2>My List</h2>
                  <p>{profiles.length} profiles saved</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="drawer-close" aria-label="Close saved list">
                <X size={20} />
              </button>
            </div>

            {profiles.length > 0 && (
              <div className="drawer-actions">
                <button type="button" onClick={() => handleExport("csv")} className="drawer-action">
                  <Download size={15} /> CSV
                </button>
                <button type="button" onClick={() => handleExport("json")} className="drawer-action">
                  <Download size={15} /> JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearList();
                    toast.success("Cleared all");
                  }}
                  className="drawer-action danger"
                >
                  <Trash2 size={15} /> Clear
                </button>
              </div>
            )}

            <div className="drawer-list-wrap">
              {profiles.length === 0 ? (
                <div className="drawer-empty">
                  <div>
                    <UserX size={38} />
                    <h3>Your list is empty</h3>
                    <p>Add creators from the results grid to build a shortlist.</p>
                  </div>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="drawer-list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="drawer-list">
                        {profiles.map((profile, index) => {
                          const handle = profile.username || profile.handle || profile.user_id;
                          return (
                            <Draggable key={profile.user_id} draggableId={profile.user_id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`drawer-item ${snapshot.isDragging ? "dragging" : ""}`}
                                  style={provided.draggableProps.style}
                                >
                                  <div {...provided.dragHandleProps} className="drag-handle" aria-label="Reorder creator">
                                    <GripVertical size={18} />
                                  </div>
                                  <img src={profile.picture} alt={`${profile.fullname} avatar`} loading="lazy" />
                                  <div>
                                    <div className="drawer-item-title">{profile.fullname}</div>
                                    <div className="drawer-item-meta">
                                      @{handle} | {getPlatformLabel(profile.platform)} | {formatFollowers(profile.followers)}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(profile)}
                                    className="remove-button"
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

            {profiles.length > 1 && <div className="drawer-help">Drag to reorder before export</div>}
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
