import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { ListDrawer } from "./ListDrawer";
import LiquidEther from "./LiquidEther";

interface Props { children: ReactNode; }

export function Layout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileCount = useListStore((s) => s.profiles.length);
  const location = useLocation();

  return (
    <div className="app-shell flex flex-col z-0">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <LiquidEther
          colors={[ '#0A1931', '#B3CFE5', '#4A7FA7', '#1A3D63', '#F6FAFD' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <nav className="nav-shell sticky top-0 z-50 w-full" aria-label="Main navigation">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] min-h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-off-white font-extrabold text-xl" aria-label="Wobb home">
            <div className="brand-mark w-9 h-9 rounded-full flex items-center justify-center font-extrabold">W</div>
            <span>Wobb</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className={`nav-action ${location.pathname === "/" ? "nav-action-active" : ""}`}
            >
              <Search size={16} />
              <span className="text-sm font-medium hidden sm:inline">Discover</span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`nav-action cursor-pointer ${drawerOpen ? "nav-action-active" : ""}`}
            >
              <Users size={16} />
              <span className="text-sm font-medium hidden sm:inline">My List</span>
              {profileCount > 0 && (
                <span className="ml-0.5 bg-accent-mint text-primary-dark text-xs font-extrabold px-2 py-0.5 rounded-pill">
                  {profileCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-7 sm:py-10 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-5 mt-auto text-center">
        <p className="text-sm text-muted-white">
          Wobb Influencer Discovery Copyright {new Date().getFullYear()}
        </p>
      </footer>

      <ListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
