"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyApplications,
  getClientAcceptedApplications,
} from "@/services/mission";
import Link from "next/link";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        let data = [];

        if (user?.role === "freelance") {
          data = await getMyApplications();
        } else if (user?.role === "client") {
          data = await getClientAcceptedApplications();
        }

        // 🔥 garder seulement les ACCEPTÉES
        const accepted = data.filter((app: { status: string; }) => app.status === "accepted");

        setConversations(accepted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p>Aucune conversation</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((app) => (
            <Link
              key={app.id}
              href={`/chat/${app.mission}/${app.freelancer}`}
              className="block border p-4 rounded hover:bg-gray-50"
            >
              <p className="font-semibold">
                Mission: {app.mission_title}
              </p>
              <p className="text-sm text-gray-600">
                {user?.role === "client"
                  ? `Freelance: ${app.freelancer_email}`
                  : `Client ID: ${app.client_email}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

