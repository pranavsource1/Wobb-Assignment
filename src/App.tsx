import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProfileDetailSkeleton } from "@/components/Skeleton";
import { SearchPage } from "@/pages/SearchPage";

const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((mod) => ({ default: mod.ProfileDetailPage }))
);

function NotFoundPage() {
  return (
    <Layout>
      <div className="not-found-panel">
        <div>
          <SearchX size={42} />
          <h3>404 Not Found</h3>
          <p>This page is not part of the creator discovery workspace.</p>
          <Link to="/" className="back-link" style={{ marginTop: 18 }}>
            <ArrowLeft size={16} />
            Back to search
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route
          path="/profile/:username"
          element={
            <Suspense fallback={<Layout><ProfileDetailSkeleton /></Layout>}>
              <ProfileDetailPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
