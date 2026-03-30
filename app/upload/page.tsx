"use client";

import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";

type UploadedFile = {
  file_id?: string;
  id?: number;
  file_name?: string;
  name?: string;
  status: "Pending" | "Uploading" | "Processed" | "Failed" | "Processing";
};

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];

    const tempFile: UploadedFile = {
      id: Date.now(),
      name: file.name,
      status: "Uploading",
    };

    setFiles((prev) => [tempFile, ...prev]);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setFiles((prev) =>
        prev.map((item) =>
          item.id === tempFile.id
            ? {
                id: item.id,
                file_id: data.file_id,
                file_name: data.file_name,
                name: file.name,
                status: "Processed",
              }
            : item
        )
      );
    } catch {
      setFiles((prev) =>
        prev.map((item) =>
          item.id === tempFile.id ? { ...item, status: "Failed" } : item
        )
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (fileId?: string, localId?: number) => {
    if (fileId) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        await fetch(`${backendUrl}/files/${fileId}`, {
          method: "DELETE",
        });
      } catch {}
    }

    setFiles((prev) =>
      prev.filter((file) => {
        // Prioritize deletion by localId (unique per session)
        if (localId !== undefined) {
          return file.id !== localId;
        }
        // Fall back to fileId for pre-existing files
        return file.file_id !== fileId;
      })
    );
  };

  const badgeClass = (status: UploadedFile["status"]) => {
    if (status === "Processed") return "bg-green-100 text-green-700";
    if (status === "Uploading" || status === "Processing")
      return "bg-blue-100 text-blue-700";
    if (status === "Pending") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Upload Files</h1>
          <p className="text-slate-600 mt-2">
            Upload your documents directly
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Drag and drop files here
            </h2>
            <p className="text-slate-600 mb-6">
              PDF, DOCX, TXT supported
            </p>

            <button
              onClick={handleChooseFile}
              className="rounded-2xl bg-slate-950 text-white px-6 py-3 font-medium hover:bg-slate-800 transition"
            >
              {uploading ? "Uploading..." : "Choose Files"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Uploaded Files
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                    File Name
                  </th>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                      No files uploaded yet
                    </td>
                  </tr>
                ) : (
                  files.map((file, index) => (
                    <tr
                      key={file.file_id || file.id || index}
                      className="border-t border-slate-200"
                    >
                      <td className="px-5 py-4 text-slate-700">
                        {file.file_name || file.name}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass(
                            file.status
                          )}`}
                        >
                          {file.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(file.file_id, file.id)}
                          className="text-red-600 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}