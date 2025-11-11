"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ReconnectionBannerProps {
  connected: boolean;
}

export const ReconnectionBanner: React.FC<ReconnectionBannerProps> = ({ connected }) => {
  return (
    <AnimatePresence>
      {!connected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto bg-red-600 text-white px-6 py-3 rounded-b-lg shadow-lg flex items-center justify-center gap-2 font-medium"
        >
          <span className="animate-pulse">⚠️ Reconnecting...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
