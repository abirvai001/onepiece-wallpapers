"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="wanted-poster w-full max-w-md rounded-xl p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-straw-hat">
            <Anchor className="h-8 w-8 text-navy" />
          </div>
          <h1 className="font-display text-3xl font-bold text-parchment">Captain&apos;s Quarters</h1>
          <p className="mt-2 text-sm text-parchment/60">Admin access only — publish wallpapers here</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="admin-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="admin-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-luffy-red/20 px-4 py-2 text-sm text-parchment">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="action-btn action-btn-primary w-full disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Boarding..." : "Enter Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}