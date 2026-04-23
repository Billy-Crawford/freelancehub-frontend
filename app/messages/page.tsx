// app/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMyApplications, getClientAcceptedApplications } from "@/services/mission";
import Link from "next/link";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        let data = [];
        if (user?.role === "freelance") {
          data = await getMyApplications();
        } else if (user?.role === "client") {
          data = await getClientAcceptedApplications();
        }
        const accepted = data.filter((app: { status: string }) => app.status === "accepted");
        setConversations(accepted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchConvs();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} active{conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-500 font-medium">Aucune conversation</p>
          <p className="text-sm text-gray-400 mt-1">
            Les conversations apparaissent après acceptation d&apos;une candidature
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((app) => (
            <Link
              key={app.id}
              href={`/chat/${app.mission}/${app.freelancer}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-5 group"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                {app.mission_title?.[0]?.toUpperCase() ?? "M"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{app.mission_title}</p>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {user?.role === "client"
                    ? `Freelance : ${app.freelancer_email}`
                    : `Client : ${app.client_email}`}
                </p>
              </div>

              <div className="shrink-0 text-indigo-400 group-hover:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

