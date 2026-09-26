"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  LogOut,
  Palette,
  RotateCcw,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardClientProps = {
  displayName: string;
  isSignedIn: boolean;
  signInHref: string;
  signOutHref: string;
};

const launcherPages = [
  {
    id: "page-1",
    apps: [
      {
        id: "code",
        name: "Kano Code",
        detail: "Build with code",
        href: "/code/",
        icon: Code2,
        color: "code",
      },
      {
        id: "art",
        name: "Make Art",
        detail: "Draw and create",
        href: "/art/",
        icon: Palette,
        color: "art",
      },
    ],
  },
];

function removeStoryCookies() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const attributes = `Max-Age=0; Path=/story/; SameSite=Lax${secure}`;
  document.cookie = `kano_story_v1_manifest=; ${attributes}`;
  for (let index = 0; index < 32; index += 1) {
    document.cookie = `kano_story_v1_chunk_${index}=; ${attributes}`;
  }
}

async function removeSiteDatabases() {
  if (typeof indexedDB.databases !== "function") return;
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.flatMap(({ name }) => {
      if (!name) return [];
      return [
        new Promise<void>((resolve) => {
          const request = indexedDB.deleteDatabase(name);
          request.onsuccess = request.onerror = request.onblocked = () => resolve();
        }),
      ];
    }),
  );
}

async function resetExperience() {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
    removeStoryCookies();
    await removeSiteDatabases();
  } finally {
    window.location.assign("/");
  }
}

export default function DashboardClient({
  displayName,
  isSignedIn,
  signInHref,
  signOutHref,
}: DashboardClientProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const currentPage = launcherPages[pageIndex];
  const avatarLetter = displayName.slice(0, 1).toLocaleUpperCase() || "G";

  return (
    <main className="launcher-page">
      <div className="launcher-shell">
        <header className="launcher-header">
          <a className="brand-mark" href="/" aria-label="Kano home">
            <span className="brand-dot" aria-hidden="true" />
            kano
          </a>

          <div className="profile-block">
            <div className="profile-avatar" aria-hidden="true">
              {avatarLetter}
            </div>
            <div className="profile-copy">
              <span className="profile-label">Welcome</span>
              <strong>{displayName}</strong>
            </div>
          </div>
        </header>

        <div className="launcher-layout">
          <a className="story-tile" href="/story/">
            <div className="story-tile-top">
              <span className="story-eyebrow">Featured</span>
              <span className="story-mark" aria-hidden="true">
                <BookOpen size={25} strokeWidth={2.2} />
              </span>
            </div>
            <div className="story-tile-bottom">
              <h1>Story Mode</h1>
              <span className="story-launch">
                Play now <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </div>
          </a>

          <section className="apps-section" aria-labelledby="apps-heading">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Make something</p>
                <h2 id="apps-heading">Your apps</h2>
              </div>
              <span className="app-count">{currentPage.apps.length} apps</span>
            </div>

            <div className="apps-grid" key={currentPage.id}>
              {currentPage.apps.map((app) => {
                const Icon = app.icon;
                return (
                  <a className="app-tile" href={app.href} key={app.id}>
                    <span className={`app-icon app-icon-${app.color}`}>
                      <Icon size={29} strokeWidth={2.1} aria-hidden="true" />
                    </span>
                    <span className="app-tile-copy">
                      <strong>{app.name}</strong>
                      <small>{app.detail}</small>
                    </span>
                    <ArrowUpRight className="app-arrow" size={18} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </section>

          <aside className="side-section" aria-live="polite">
            {isSignedIn ? (
              <div className="staff-picks">
                <div className="staff-picks-heading">
                  <Sparkles size={18} aria-hidden="true" />
                  <h2>Staff Picks</h2>
                </div>
                <p>No picks yet.</p>
              </div>
            ) : (
              <div className="signin-panel">
                <span className="signin-symbol" aria-hidden="true">
                  <Sparkles size={22} />
                </span>
                <p className="section-eyebrow">Your Kano account</p>
                <h2>Sign in to continue</h2>
                <a className="chatgpt-signin" href={signInHref} target="_top">
                  Sign in with ChatGPT
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            )}
          </aside>
        </div>

        <footer className="launcher-footer">
          <div className="page-selector" aria-label="Dashboard pages">
            <button
              type="button"
              className="page-arrow"
              aria-label="Previous page"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <span className="page-position">
              <strong>{pageIndex + 1}</strong> / {launcherPages.length}
            </span>
            <button
              type="button"
              className="page-arrow"
              aria-label="Next page"
              disabled={pageIndex >= launcherPages.length - 1}
              onClick={() =>
                setPageIndex((index) => Math.min(launcherPages.length - 1, index + 1))
              }
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="settings-button" aria-label="Settings" title="Settings">
                <Settings2 size={20} aria-hidden="true" />
                <span>Settings</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="settings-menu">
              <DropdownMenuLabel>Experience</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild disabled={!isSignedIn}>
                <a href={signOutHref} target="_top" aria-disabled={!isSignedIn}>
                  <LogOut size={16} aria-hidden="true" />
                  Sign Out
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setResetOpen(true)}>
                <RotateCcw size={16} aria-hidden="true" />
                Reset Experience
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset your experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears saved app data and Story Mode progress from this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void resetExperience()}>
              Reset Experience
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
