import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

function firstNameFrom(fullName: string | null, email: string): string {
  const name = fullName?.trim() || email.split("@")[0].replace(/[._+-]+/g, " ");
  const first = name.trim().split(/\s+/)[0] || "Guest";
  return first.charAt(0).toLocaleUpperCase() + first.slice(1);
}

export default async function Home() {
  const user = await getChatGPTUser();
  return (
    <DashboardClient
      displayName={user ? firstNameFrom(user.fullName, user.email) : "Guest"}
      isSignedIn={Boolean(user)}
      signInHref={chatGPTSignInPath("/")}
      signOutHref={chatGPTSignOutPath("/")}
    />
  );
}
