import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { ListDrawer } from "./ListDrawer";

interface Props { children: ReactNode; }

export function Layout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileCount = useListStore((s) => s.profiles.length);
  const location = useLocation();

  return (
    <div className="app-shell">
      <nav className="app-nav" aria-label="Main navigation">
        <div className="nav-inner">
          <Link to="/" className="brand" aria-label="Wobb home">
            <span className="brand-mark">W</span>
            <span>Wobb</span>
          </Link>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <Search size={16} />
              <span>Discover</span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`nav-link nav-button ${drawerOpen ? "active" : ""}`}
            >
              <Users size={16} />
              <span>My List</span>
              {profileCount > 0 && <span className="count-badge">{profileCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span><span className="footer-mark">Wobb</span> creator discovery workspace</span>
          <span>Instagram, YouTube, and TikTok profiles in one list</span>
        </div>
      </footer>

      <ListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
