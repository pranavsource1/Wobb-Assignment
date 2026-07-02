export function ProfileCardSkeleton() {
  return (
    <div className="surface-panel rounded-cards p-5 flex flex-col gap-5 h-[330px]">
      <div className="flex items-start justify-between">
        <div className="skeleton-anim w-[68px] h-[68px] rounded-full" />
        <div className="skeleton-anim w-24 h-8 rounded-pill" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="skeleton-anim w-3/4 h-6 rounded" />
        <div className="skeleton-anim w-1/2 h-4 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="skeleton-anim h-16 w-full rounded-[14px]" />
        <div className="skeleton-anim h-16 w-full rounded-[14px]" />
        <div className="skeleton-anim h-16 w-full rounded-[14px]" />
      </div>

      <div className="skeleton-anim w-full h-11 rounded-pill" />
    </div>
  );
}

export function ProfileDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="skeleton-anim w-36 h-11 rounded-pill mb-6" />
      
      <div className="profile-hero p-6 sm:p-8 lg:p-10 grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center mb-7">
        <div className="skeleton-anim w-32 h-32 md:w-40 md:h-40 rounded-full shrink-0" />
        <div className="flex-1 w-full flex flex-col items-center lg:items-start gap-4">
          <div className="skeleton-anim w-24 h-6 rounded-pill" />
          <div className="skeleton-anim w-3/4 h-10 rounded" />
          <div className="skeleton-anim w-1/3 h-5 rounded" />
          <div className="skeleton-anim w-full h-16 rounded" />
          <div className="flex gap-4 mt-6 w-full md:w-auto">
            <div className="skeleton-anim w-full md:w-32 h-12 rounded-pill" />
            <div className="skeleton-anim w-full md:w-32 h-12 rounded-pill" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-anim h-24 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
