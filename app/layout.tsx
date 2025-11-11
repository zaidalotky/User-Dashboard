import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "User Activity Dashboard",
  description: "Real-time updates with WebSocket and SWR",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children} and hello motherfucker
      </body>
    </html>
  );
}
