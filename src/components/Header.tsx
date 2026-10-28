"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import type { Category } from "@/lib/types";
import BanglaDate from "./BanglaDate";
import Avatar from "./Avatar";

function UserMenu({ name, email, image }: { name: string; email: string; image?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  // close the menu after navigating
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে।");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন।");
        },
      },
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn btn-ghost btn-sm h-10 gap-2 px-1.5 sm:btn-md sm:px-3"
      >
        <Avatar name={name} image={image} className="size-8 rounded-[10px] text-sm sm:size-9" />
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{name.split(" ")[0]}</span>
        <span className="text-xs" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-ink/70">{email}</p>
          </div>
          <Link role="menuitem" href="/profile" className="block rounded-lg px-3 py-1.5 text-sm hover:bg-ink/10">
            👤 আমার প্রোফাইল
          </Link>
          <Link
            role="menuitem"
            href="/profile/update"
            className="block rounded-lg px-3 py-1.5 text-sm hover:bg-ink/10"
          >
            ✏️ তথ্য আপডেট করুন
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-1.5 text-left text-sm text-rise hover:bg-ink/10"
          >
            ↩ সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="বাজার দর — হোম">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-lg" aria-hidden>
            🛒
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xl font-bold leading-7">বাজার দর</span>
            <BanglaDate className="truncate text-xs leading-4 text-ink/60" />
          </span>
        </Link>
        <div className="flex-1" />
        {isPending ? (
          <div className="skeleton h-10 w-24 bg-page sm:w-40" aria-label="লোড হচ্ছে" />
        ) : session ? (
          <UserMenu name={session.user.name} email={session.user.email} image={session.user.image} />
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/signin"
              className={`btn btn-ghost btn-sm sm:btn-md ${pathname === "/signin" ? "bg-ink/10" : ""}`}
            >
              সাইন ইন
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
              সাইন আপ
            </Link>
          </div>
        )}
      </div>
      <nav className="border-t border-page" aria-label="ক্যাটাগরি">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          {categories.map((c) => {
            const href = `/category/${c.slug}`;
            const active = pathname === href;
            return (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition ${
                    active
                      ? "border-brand-dark bg-brand-dark text-primary-content"
                      : "border-transparent hover:border-[#ccd0cc] hover:bg-[#dadeda]"
                  }`}
                >
                  <span aria-hidden>{c.icon}</span>
                  {c.nameBn}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
