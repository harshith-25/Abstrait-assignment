import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bookmark } from "@/types/bookmark";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Dashboard — Markly",
  description: "Manage your bookmarks with a smooth, glassmorphic interface.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch initial bookmarks on the server side
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardContent 
      user={user} 
      initialBookmarks={(bookmarks as Bookmark[]) || []} 
    />
  );
}
