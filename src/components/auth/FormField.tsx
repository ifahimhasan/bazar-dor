"use client";

import { useId, useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export default function FormField({ label, error, type = "text", ...rest }: Props) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={`flex h-10 items-center rounded-lg border bg-surface px-3 focus-within:border-brand ${
          error ? "border-rise" : "border-ink/20"
        }`}
      >
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/50"
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="ml-2 shrink-0 text-xs text-ink/60 hover:text-brand"
            aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
          >
            {show ? "লুকান" : "দেখুন"}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} className="text-xs text-rise">
          {error}
        </p>
      )}
    </div>
  );
}
