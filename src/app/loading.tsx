import { GridSkeleton, LoadingLabel } from "@/components/Skeletons";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="skeleton h-72 rounded-3xl bg-surface" />
      <LoadingLabel />
      <section className="flex flex-col gap-3">
        <div className="skeleton h-7 w-40 bg-surface" />
        <GridSkeleton />
      </section>
      <section className="flex flex-col gap-3">
        <div className="skeleton h-7 w-40 bg-surface" />
        <GridSkeleton />
      </section>
    </div>
  );
}
