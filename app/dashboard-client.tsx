"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { saveData, loadData } from "@/lib/data-backup";

type LauncherApp = {
  id: string;
  name: string;
  href: string;
  icon: "code" | "art" | "minecraft" | "hack" | "projects";
};

const launcherPages: { id: string; apps: LauncherApp[] }[] = [
  {
    id: "page-1",
    apps: [
      { id: "code", name: "Kano Code", href: "/code/", icon: "code" },
      { id: "art", name: "Make Art", href: "/art/", icon: "art" },
      { id: "projects", name: "Projects", href: "http://os-redirect.kano.me/os-projects", icon: "projects" },
  { id: "minecraft", name: "Make Minecraft", href: "/make-minecraft/minecraft/", icon: "minecraft" },
      { id: "hack", name: "Hack Minecraft", href: "/hack-minecraft/", icon: "hack" },
    ],
  },
];

function SkyArtwork() {
  return (
    <svg className="sky-artwork" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        className="cloud-bank cloud-bank-back"
        d="M0 525c88-8 62-103 159-116 91-12 103 69 184 70 76 1 95-89 184-90 98-1 104 93 198 91 91-2 105-161 228-165 124-4 107 124 229 128 91 3 102-74 192-75 102-1 111 95 226 90v442H0z"
      />
      <path
        className="cloud-bank cloud-bank-front"
        d="M0 654c117-6 91-107 214-113 96-5 107 78 205 80 95 2 102-92 207-95 112-3 115 94 228 93 105-1 112-115 230-119 113-4 125 92 235 93 100 1 111-62 197-60 37 1 63 12 84 27v340H0z"
      />
      <path
        className="cloud-bank cloud-bank-light"
        d="M0 761c130-20 164-91 273-79 106 12 111 86 222 89 113 3 122-73 225-73 110 0 122 92 248 91 127-2 150-76 267-69 111 7 158 63 365 41v139H0z"
      />
    </svg>
  );
}

function GuestAvatar() {
  return (
    <svg className="profile-avatar" viewBox="0 0 64 64" role="img" aria-label="Profile">
      <circle cx="32" cy="32" r="31" fill="#d49a57" />
      <path d="M12 29c1-15 11-24 23-23 11 1 18 9 18 22-6-4-10-7-15-12-6 7-14 11-26 13Z" fill="#694a31" />
      <path d="M14 34c0-12 8-21 19-21s18 9 18 21v5c0 12-8 19-19 19S14 51 14 39z" fill="#f2c88e" />
      <path d="M14 31c8-2 17-7 24-15 4 6 9 10 14 12v-5C52 12 44 5 34 5 22 5 14 14 12 27z" fill="#76553a" />
      <path d="M8 58c2-9 9-15 20-17l4 6 5-6c10 2 17 8 19 17-7 4-15 6-24 6S15 62 8 58Z" fill="#398fbe" />
      <circle cx="26" cy="35" r="1.8" fill="#4d3b2d" />
      <circle cx="40" cy="35" r="1.8" fill="#4d3b2d" />
      <path d="M28 43c3 2 6 2 9 0" fill="none" stroke="#a86549" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" />
    </svg>
  );
}

function StoryArtwork() {
  return <img className="story-artwork" src="/dashboard/story-mode-tile.png" alt="" />;
}

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

export default function DashboardClient() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dataBusy, setDataBusy] = useState(false);
  const [dataError, setDataError] = useState("");
  async function runDataAction(action: () => Promise<void>) {
    setDataBusy(true); setDataError("");
    try { await action(); } catch (error) { setDataError(error instanceof Error ? error.message : "Could not transfer saved data."); }
    finally { setDataBusy(false); }
  }
  const [pageIndex, setPageIndex] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const currentPageIndex = Math.min(pageIndex, launcherPages.length - 1);
  const currentPage = launcherPages[currentPageIndex];

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">
        <div className="profile-block">
          <img className="profile-avatar" src="/dashboard/judoka-avatar.png" alt="Profile" />
          <div className="profile-copy">
            <strong>Guest</strong>
            <span>Level 1</span>
          </div>
        </div>
      </header>

      <span className="notification-indicator" role="img" aria-label="No notifications" title="No notifications">
        <span className="notification-icon" aria-hidden="true" />
      </span>

      <div className="dashboard-content">
        <section className="dashboard-zone story-zone" aria-labelledby="story-heading">
          <h1 id="story-heading" className="zone-title">Story Mode</h1>
          <a className="story-tile" href="/story/" target="_top" aria-label="Play Story Mode">
            <StoryArtwork />
          </a>
        </section>

        <section className="dashboard-zone apps-zone" aria-labelledby="apps-heading">
          <h2 id="apps-heading" className="zone-title">Apps</h2>
          <div className="apps-grid" key={currentPage.id}>
            {currentPage.apps.map((app) => (
              <a className={`app-tile app-tile-${app.icon}`} href={app.href} target="_top" key={app.id}>
                <span className={`app-icon app-icon-${app.icon}`}>
                  {app.icon === "code" ? (
                    <img src="/dashboard/kano-code-logo.png" alt="" />
                  ) : app.icon === "hack" ? (
                    <img src="/dashboard/hack-minecraft-logo.png" alt="" />
                  ) : app.icon === "minecraft" ? (
                    <img src="/dashboard/make-minecraft-logo.png" alt="" />
                  ) : app.icon === "projects" ? (
                    <img src="/dashboard/projects-logo.png" alt="" />
                  ) : (
                    <img src="/dashboard/make-art-logo.png" alt="" />
                  )}
                </span>
                <span className="app-name">{app.name}</span>
              </a>
            ))}
          </div>
        </section>

        <aside className="dashboard-zone account-zone" aria-live="polite">
          <h2 className="zone-title">Kano World</h2>
          <div className="account-panel">
            <span className="login-disabled">Login is currently disabled</span>
          </div>
        </aside>
      </div>

      <footer className="dashboard-controls">
        <nav className="page-selector" aria-label="Dashboard pages">
          {launcherPages.map((page, index) => (
            <button
              type="button"
              key={page.id}
              className={`page-button${index === currentPageIndex ? " is-current" : ""}`}
              aria-label={`Page ${index + 1} of ${launcherPages.length}`}
              aria-current={index === currentPageIndex ? "page" : undefined}
              onClick={() => setPageIndex(index)}
            >
              <span className="os-page-indicator" aria-hidden="true">
                {Array.from({ length: 9 }, (_, slot) => (
                  <span key={slot} className={slot < page.apps.length ? "is-filled" : undefined} />
                ))}
              </span>
            </button>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="settings-button" aria-label="Settings" title="Settings">
              <span className="os-settings-icon" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={8} className="settings-popover">
            <DropdownMenuItem disabled={dataBusy} onSelect={() => void runDataAction(saveData)}>
              <Download size={16} aria-hidden="true" />
              Save Data
            </DropdownMenuItem>
            <DropdownMenuItem disabled={dataBusy} onSelect={() => fileInput.current?.click()}>
              <Upload size={16} aria-hidden="true" />
              Load Data
            </DropdownMenuItem>
            <DropdownMenuItem disabled={dataBusy} onSelect={() => setResetOpen(true)}>
              <RotateCcw size={16} aria-hidden="true" />
              Reset Experience
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>

      <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={(event) => {
        const file = event.target.files?.[0]; event.target.value = "";
        if (file) void runDataAction(async () => { await loadData(file); window.location.assign("/"); });
      }} />
      <AlertDialog open={!!dataError} onOpenChange={(open) => { if (!open) setDataError(""); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Saved Data</AlertDialogTitle><AlertDialogDescription>{dataError}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction onClick={() => setDataError("")}>OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Experience?</AlertDialogTitle>
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
