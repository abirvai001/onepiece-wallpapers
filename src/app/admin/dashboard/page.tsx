import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminUploadForm } from "@/components/AdminUploadForm";
import { AdminWallpaperList } from "@/components/AdminWallpaperList";
import { LogOut, Shield } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [categories, wallpapers] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] }),
    prisma.wallpaper.findMany({
      orderBy: { createdAt: "desc" },
      include: { categories: { include: { category: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gold">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="font-display mt-2 text-4xl font-bold text-parchment">
            Publish Wallpapers
          </h1>
          <p className="mt-1 text-sm text-parchment/60">
            Logged in as {session.user?.email}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="action-btn action-btn-secondary">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>

      <section className="mb-12 rounded-xl border border-gold/20 bg-navy/40 p-6 sm:p-8">
        <h2 className="font-display mb-6 text-2xl font-bold text-parchment">Upload New Wallpaper</h2>
        <AdminUploadForm categories={categories} />
      </section>

      <section className="rounded-xl border border-gold/20 bg-navy/40 p-6 sm:p-8">
        <h2 className="font-display mb-6 text-2xl font-bold text-parchment">
          Manage Wallpapers ({wallpapers.length})
        </h2>
        <AdminWallpaperList wallpapers={wallpapers} />
      </section>
    </div>
  );
}