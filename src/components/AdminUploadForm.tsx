"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Smartphone, Monitor } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

type AdminUploadFormProps = {
  categories: Category[];
};

export function AdminUploadForm({ categories }: AdminUploadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      setSuccess(`"${data.title}" published successfully!`);
      form.reset();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const deviceCategories = categories.filter((c) => c.type === "device");
  const arcCategories = categories.filter((c) => c.type === "arc");
  const characterCategories = categories.filter((c) => c.type === "character");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="admin-label">Wallpaper Image *</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            required
            className="admin-input file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-bold file:text-navy"
          />
        </div>

        <div className="sm:col-span-2">
          <p className="admin-label mb-3">Screen Type *</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {deviceCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/20 bg-ocean/30 p-4 transition hover:border-gold has-[:checked]:border-gold has-[:checked]:bg-ocean/50"
              >
                <input
                  type="radio"
                  name="deviceCategoryId"
                  value={cat.id}
                  required
                  className="accent-straw-hat"
                />
                {cat.slug === "mobile" ? (
                  <Smartphone className="h-5 w-5 shrink-0 text-gold" />
                ) : (
                  <Monitor className="h-5 w-5 shrink-0 text-gold" />
                )}
                <div>
                  <p className="text-sm font-bold text-parchment">{cat.name}</p>
                  <p className="text-xs text-parchment/60">{cat.slug === "mobile" ? "Portrait / phone" : "Landscape / PC"}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="admin-label">Title *</label>
          <input type="text" name="title" required className="admin-input" placeholder="Gear 5 Luffy — Wano Sunset" />
        </div>

        <div>
          <label className="admin-label">Artist Name *</label>
          <input type="text" name="artistName" required className="admin-input" placeholder="Artist name" />
        </div>

        <div>
          <label className="admin-label">Artist URL</label>
          <input type="url" name="artistUrl" className="admin-input" placeholder="https://..." />
        </div>

        <div className="sm:col-span-2">
          <label className="admin-label">Description</label>
          <textarea
            name="description"
            rows={3}
            className="admin-input resize-none"
            placeholder="Optional description..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-parchment">
            <input type="checkbox" name="isTrending" value="true" className="accent-straw-hat" />
            Mark as Trending
          </label>
        </div>
      </div>

      <div>
        <p className="admin-label mb-3">Arc Categories</p>
        <div className="flex flex-wrap gap-2">
          {arcCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gold/20 bg-ocean/30 px-3 py-1.5 text-xs text-parchment hover:border-gold"
            >
              <input type="checkbox" name="categoryIds" value={cat.id} className="accent-straw-hat" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="admin-label mb-3">Character Categories</p>
        <div className="flex flex-wrap gap-2">
          {characterCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gold/20 bg-ocean/30 px-3 py-1.5 text-xs text-parchment hover:border-gold"
            >
              <input type="checkbox" name="categoryIds" value={cat.id} className="accent-straw-hat" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-luffy-red/20 px-4 py-2 text-sm text-parchment">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-straw-hat/20 px-4 py-2 text-sm text-parchment">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="action-btn action-btn-primary disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Publish Wallpaper
          </>
        )}
      </button>
    </form>
  );
}