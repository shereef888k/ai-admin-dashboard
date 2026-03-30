"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export default function TestChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "bot", text: "Hello! Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
       
          
  "query": message,
  "top_k": 5,
  "stream": false


        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from backend");
      }

      const data = await res.json();

      const botMessage: ChatMessage = {
        role: "bot",
        text: data.answer || "No reply received.",
      };

      setChat((prev) => [...prev, botMessage]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Error: Could not connect to backend.",
        },
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Test Chat</h1>
          <p className="text-slate-600 mt-2">
            Test the chatbot with your documents
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-[75vh] flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xl px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="max-w-xl px-4 py-3 rounded-2xl text-sm shadow-sm bg-slate-100 text-slate-500">
                Typing...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4 flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-2xl bg-slate-950 text-white px-6 py-3 font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}