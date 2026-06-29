export function ProfileCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-row">
        <div className="skeleton-anim skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-anim skeleton-line" style={{ width: "70%" }} />
          <div className="skeleton-anim skeleton-line" style={{ width: "48%" }} />
        </div>
      </div>
      <div className="skeleton-anim skeleton-line" style={{ width: "100%", height: 58, marginTop: 26 }} />
      <div className="skeleton-anim skeleton-line" style={{ width: "100%", height: 42, marginTop: 16 }} />
    </div>
  );
}

export function ProfileDetailSkeleton() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-anim skeleton-line" style={{ width: 150, height: 38, marginBottom: 24 }} />
      <div className="skeleton-row">
        <div className="skeleton-anim" style={{ width: 112, height: 112 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton-anim skeleton-line" style={{ width: "58%", height: 42 }} />
          <div className="skeleton-anim skeleton-line" style={{ width: "34%", height: 18 }} />
          <div className="skeleton-anim skeleton-line" style={{ width: "76%", height: 52, marginTop: 24 }} />
        </div>
      </div>
      <div className="detail-stats">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-anim" style={{ height: 104 }} />
        ))}
      </div>
    </div>
  );
}
