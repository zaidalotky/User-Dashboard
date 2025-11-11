"use client";

import { useState, useRef } from "react";
import { useWebSocket, UserEvent } from "../hooks/useWebSocket";
import { useUsers } from "../hooks/useUsers";
import { OnlineUsers } from "./OnlineUsers";
import { ActivityFeed } from "./ActivityFeed";
import { ReconnectionBanner } from "./ReconnectionBanner";

export const Dashboard = () => {
  const { addOnlineUser, removeOnlineUser } = useUsers();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [activityFeed, setActivityFeed] = useState<UserEvent[]>([]);
  const receivedEvents = useRef(new Set<string>());

  const handleWsMessage = (event: UserEvent) => {
    const eventId = `${event.type}:${event.user}:${event.timestamp}`;
    if (receivedEvents.current.has(eventId)) return;
    receivedEvents.current.add(eventId);

    if (event.type === "LOGIN") {
      addOnlineUser(event.user);
      setOnlineUsers((prev) =>
        prev.includes(event.user) ? prev : [...prev, event.user]
      );
    } else if (event.type === "LOGOUT") {
      setOnlineUsers((prev) => prev.filter((u) => u !== event.user));
      removeOnlineUser(event.user);
    }

    setActivityFeed((prev) => [event, ...prev]);
  };

  const { connected } = useWebSocket(handleWsMessage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 font-sans">
      {/* Reconnection Banner */}
      <ReconnectionBanner connected={connected} />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Online Users Panel */}
        <div className="lg:w-1/3 bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 tracking-wide text-teal-400">
            Online Users
          </h2>
          <div className="flex flex-col gap-3">
            {onlineUsers.map((user) => (
              <div
                key={user}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/40 transition"
              >
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-white">{user}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed Panel */}
        <div className="lg:w-2/3 bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 tracking-wide text-cyan-400">
            Activity Feed
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] pr-2">
            {activityFeed.map((event, idx) => (
              <div
                key={`${event.user}-${event.timestamp}-${idx}`}
                className={`p-3 rounded-lg border-l-4 ${
                  event.type === "LOGIN"
                    ? "border-green-400 bg-gray-700/50"
                    : "border-red-400 bg-gray-700/40"
                }`}
              >
                <span className="font-semibold">{event.user}</span>{" "}
                {event.type === "LOGIN" ? "logged in" : "logged out"} at{" "}
                <span className="text-gray-300">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
