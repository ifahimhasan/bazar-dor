"use client";

import { useEffect, useState } from "react";
import { banglaDate } from "@/lib/bn";

/** Shows today's date in Bangla, refreshed on the client so it never goes stale */
export default function BanglaDate({ className }: { className?: string }) {
  const [text, setText] = useState(() => banglaDate());
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refresh a possibly cached server date
    setText(banglaDate());
  }, []);
  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
