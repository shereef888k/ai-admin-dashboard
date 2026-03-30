"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BackendStatus from "../components/BackendStatus";

type Stats = {
  title: string;
  value: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [overview, setOverview] = useState({
    filesUploaded: 0,
    filesPending: 0,
    chatsTested: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        
        setStats([
          { title: "Uploaded Files", value: data.uploaded_files?.toString() || "0" },
          { title: "Processed", value: data.processed_files?.toString() || "0" },
          { title: "Pending", value: data.pending_files?.toString() || "0" },
        ]);

        setOverview({
          filesUploaded: data.uploaded_files || 0,
          filesPending: data.pending_files || 0,
          chatsTested: data.chats_tested || 0,
        });
      } catch {
        setStats([
          { title: "Uploaded Files", value: "0" },
          { title: "Processed", value: "0" },
          { title: "Pending", value: "0" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-600 mt-2">
            Upload files and test chatbot
          </p>
        </div>

        {/* ✅ ADD THIS LINE */}
        <BackendStatus />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-slate-500">
              Loading stats...
            </div>
          ) : (
            stats.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
              >
                <p className="text-sm font-medium text-slate-500">{item.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {item.value}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Overview
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-500">Files Uploaded</p>
                <p className="text-2xl font-bold text-slate-900">{overview.filesUploaded}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Files Waiting</p>
                <p className="text-2xl font-bold text-slate-900">{overview.filesPending}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Chats Tested Today</p>
                <p className="text-2xl font-bold text-slate-900">{overview.chatsTested}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}