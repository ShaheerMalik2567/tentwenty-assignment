"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name ?? "John Doe";

  const timesheetsActive =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/timesheets");

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-10 xl:px-12">
      <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-8">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight lowercase text-brand-gray-900"
        >
          ticktock
        </Link>
        <nav aria-label="Main">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-normal transition-colors",
              timesheetsActive
                ? "text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            Timesheets
          </Link>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-normal text-neutral-600 outline-none",
              "hover:bg-neutral-50 hover:text-neutral-900",
              "focus-visible:ring-2 focus-visible:ring-brand-600/30 focus-visible:ring-offset-2",
              "data-popup-open:bg-neutral-50 data-popup-open:text-neutral-900",
            )}
            aria-label="Account menu"
          >
            <span className="max-w-[140px] truncate sm:max-w-[200px]">
              {displayName}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-neutral-900">
                {displayName}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  signOut({ callbackUrl: "/login", redirect: true })
                }
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <span
          className="size-2 shrink-0 rounded-full bg-green-500"
          title="Online"
          aria-hidden
        />
      </div>
    </header>
  );
}
