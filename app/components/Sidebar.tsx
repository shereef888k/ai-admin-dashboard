import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">AI Admin</h1>

      <nav className="space-y-3">
        <Link
          href="/dashboard"
          className="block rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-800 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/upload"
          className="block rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-800 transition"
        >
          Upload
        </Link>

        <Link
          href="/test-chat"
          className="block rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-800 transition"
        >
          Test Chat
        </Link>
      </nav>
    </aside>
  );
}