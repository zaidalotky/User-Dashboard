"use client";

import { UserEvent } from "../hooks/useWebSocket";

type Props = { events: UserEvent[] };

export const ActivityFeed = ({ events }: Props) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Activity Feed</h2>
    <ul className="bg-gray-100 p-2 rounded max-h-96 overflow-y-auto">
      {events.length ? (
        events.map((ev, i) => (
          <li key={i}>
            [{new Date(ev.timestamp).toLocaleTimeString()}] {ev.user} {ev.type}
          </li>
        ))
      ) : (
        <li>No activity yet</li>
      )}
    </ul>
  </div>
);
