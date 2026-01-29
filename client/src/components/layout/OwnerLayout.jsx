import React, { useState } from "react";
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
        <div className="w-full">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuClick={() => setIsMobileDrawerOpen(true)} />
    </div>
  );
};

export default OwnerLayout;
