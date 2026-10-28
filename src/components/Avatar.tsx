/* eslint-disable @next/next/no-img-element -- avatars come from any OAuth host */
export default function Avatar({
  name,
  image,
  className = "",
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return <img src={image} alt={name} referrerPolicy="no-referrer" className={`object-cover ${className}`} />;
  }
  return (
    <span className={`grid place-items-center bg-brand font-bold text-primary-content ${className}`} aria-hidden>
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
