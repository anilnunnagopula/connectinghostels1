import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import MobileDrawer from "./MobileDrawer";

/**
 * OwnerLayout Component
 * Wrapper for all owner pages with sidebar navigation
 *
 * Features:
 * - Desktop: Fixed sidebar navigation
 * - Mobile: Bottom navigation + drawer menu
 * - Responsive padding to prevent content overlap
 */
const OwnerLayout = ({ children }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <main
        className="
          min-h-screen
          lg:ml-64
          pt-16
          pb-20 lg:pb-6
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuClick={() => setIsMobileDrawerOpen(true)} />
    </div>
  );
};

export default OwnerLayout;
