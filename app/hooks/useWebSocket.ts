"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UserEvent {
  user: string;
  type: string;
  timestamp: number
} 


interface UseWebSocketReturn {
  connected: boolean;
  lastMessage?: UserEvent;
  sendMessage: (msg: UserEvent) => void;
}

export function useWebSocket(
  onMessage: (msg: UserEvent) => void
): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<UserEvent>();
  const retryAttempt = useRef(0);

  const WS_URL =
    process.env.NODE_ENV === "development"
      ? "ws://localhost:4000/mock"
      : "wss://your-production-domain.com/mock";

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryAttempt.current = 0;
      console.log("✅ Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data: UserEvent = JSON.parse(event.data);
        // validate type
        if (data.type !== "LOGIN" && data.type !== "LOGOUT") return;
        setLastMessage(data);
        onMessage(data);
      } catch {
        console.warn("⚠️ Invalid WebSocket message:", event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      const delay = Math.min(1000 * 2 ** retryAttempt.current, 30000);
      retryAttempt.current += 1;
      console.log(`🔁 Reconnecting in ${delay / 1000}s`);
      reconnectTimeout.current = setTimeout(connect, delay);
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      ws.close();
    };
  }, [WS_URL, onMessage]);

  const sendMessage = useCallback(
    (msg: UserEvent) => {
      if (wsRef.current && connected) {
        wsRef.current.send(JSON.stringify(msg));
      }
    },
    [connected]
  );

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, []);

  return { connected, lastMessage, sendMessage };
}
