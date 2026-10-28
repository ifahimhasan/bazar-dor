import { LoadingLabel } from "@/components/Skeletons";

export default function ProductLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="skeleton h-5 w-56 bg-surface" />
      <div className="skeleton h-40 rounded-2xl bg-surface" />
      <LoadingLabel />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl bg-surface" />
        ))}
      </div>
      <div className="skeleton h-80 rounded-2xl bg-surface" />
    </div>
  );
}
