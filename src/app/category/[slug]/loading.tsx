import { GridSkeleton, LoadingLabel } from "@/components/Skeletons";

export default function CategoryLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5">
        <div className="skeleton size-10 rounded-xl bg-page" />
        <div className="flex flex-col gap-2">
          <div className="skeleton h-6 w-28 bg-page" />
          <div className="skeleton h-4 w-48 bg-page" />
        </div>
      </div>
      <div className="skeleton h-16 rounded-2xl bg-surface" />
      <LoadingLabel />
      <GridSkeleton count={6} />
    </div>
  );
}
