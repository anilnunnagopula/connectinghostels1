import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Bell,
  Megaphone,
  CheckCircle,
  AlertCircle,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  X,
  Info,
} from "lucide-react";
import api from "../../apiConfig";
import { useNotifications } from "../../hooks/useQueries";
import { SkeletonListItem } from "../../components/ui/SkeletonCard";
import { useSocket } from "../../context/SocketContext";

// ============================================================================
// CONSTANTS
// ============================================================================

const NOTIFICATION_TYPES = {
  ALL: "all",
  ALERT: "alert",
  INFO: "info",
  SUCCESS: "success",
};

const ICON_MAP = {
  alert: { icon: Megaphone, color: "text-yellow-500" },
  info: { icon: Bell, color: "text-blue-500" },
  success: { icon: CheckCircle, color: "text-green-500" },
  fee: { icon: Info, color: "text-orange-500" },
  holiday: { icon: Megaphone, color: "text-purple-500" },
  welcome: { icon: CheckCircle, color: "text-green-500" },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const groupNotificationsByDate = (notifications) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = { today: [], yesterday: [], older: [] };

  notifications.forEach((notification) => {
    const notificationDate = new Date(
      notification.createdAt || notification.time,
    );
    notificationDate.setHours(0, 0, 0, 0);

    if (notificationDate.getTime() === today.getTime()) {
      groups.today.push(notification);
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return past.toLocaleDateString();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Notifications = () => {
  const queryClient = useQueryClient();
  const { setUnreadCount } = useSocket();

  // TanStack Query — auto-refetches every 30s (refetchInterval set in hook)
  const { data, isLoading, isError } = useNotifications(1);
  const notifications = useMemo(() => data?.notifications || [], [data?.notifications]);

  // Clear the global unread badge when this page is opened
  useEffect(() => {
    setUnreadCount(0);
  }, [setUnreadCount]);

  // ==========================================================================
  // LOCAL UI STATE
  // ==========================================================================

  const [filterType, setFilterType] = useState(NOTIFICATION_TYPES.ALL);
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  // ==========================================================================
  // COMPUTED VALUES (Memoized)
  // ==========================================================================

  const filteredNotifications = useMemo(() => {
    if (filterType === NOTIFICATION_TYPES.ALL) return notifications;
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const typeCounts = useMemo(
    () => ({
      all: notifications.length,
      alert: notifications.filter((n) => n.type === "alert" || n.type === "holiday").length,
      info: notifications.filter((n) => n.type === "info" || n.type === "fee").length,
      success: notifications.filter((n) => n.type === "success" || n.type === "welcome").length,
    }),
    [notifications],
  );

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      setMarkingAsRead(notificationId);

      // Optimistic update in TanStack Query cache
      queryClient.setQueryData(["notifications", 1], (old) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n) =>
            n._id === notificationId || n.id === notificationId
              ? { ...n, isRead: true }
              : n,
          ),
        };
      });

      try {
        await api.patch(`/api/student/notifications/${notificationId}/read`);
      } catch (error) {
        // Revert by refetching
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.error("Failed to mark as read");
      } finally {
        setMarkingAsRead(null);
      }
    },
    [queryClient],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    // Optimistic update
    queryClient.setQueryData(["notifications", 1], (old) => {
      if (!old) return old;
      return {
        ...old,
        notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
      };
    });

    try {
      await api.patch("/api/student/notifications/mark-all-read");
      toast.success("All notifications marked as read");
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.error("Failed to mark all as read");
    }
  }, [queryClient]);

  const handleClearAll = useCallback(async () => {
    setClearing(true);

    // Optimistic update
    queryClient.setQueryData(["notifications", 1], (old) => {
      if (!old) return old;
      return { ...old, notifications: [] };
    });
    setShowClearModal(false);

    try {
      await api.delete("/api/student/notifications/clear-all");
      toast.success("All notifications cleared");
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.error("Failed to clear notifications");
    } finally {
      setClearing(false);
    }
  }, [queryClient]);

  const handleFilterChange = useCallback((type) => {
    setFilterType(type);
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    toast.success("Refreshing notifications...");
  }, [queryClient]);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const renderFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
        <button
          key={value}
          onClick={() => handleFilterChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filterType === value
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
          }`}
        >
          {key.charAt(0) + key.slice(1).toLowerCase()}
          {typeCounts[value] > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-full">
              {typeCounts[value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const renderActions = () => {
    if (notifications.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        <button
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          <Trash2 size={16} />
          Clear all
        </button>
      </div>
    );
  };

  const renderNotification = (notification) => {
    const notificationId = notification._id || notification.id;
    const notificationType = notification.type || "info";
    const iconConfig = ICON_MAP[notificationType] || ICON_MAP.info;
    const IconComponent = iconConfig.icon;
    const isMarking = markingAsRead === notificationId;

    return (
      <div
        key={notificationId}
        className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-start gap-4 transition ${
          !notification.isRead ? "border-l-4 border-blue-500" : ""
        }`}
      >
        <div className="mt-1">
          <IconComponent className={`${iconConfig.color} w-5 h-5`} />
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-base text-gray-800 dark:text-white">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {formatTimeAgo(notification.createdAt || notification.time)}
          </p>
        </div>
        {!notification.isRead && (
          <button
            onClick={() => handleMarkAsRead(notificationId)}
            disabled={isMarking}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            aria-label="Mark as read"
          >
            {isMarking ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
          </button>
        )}
      </div>
    );
  };

  const renderDateGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-300 flex items-center gap-2">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-slate-400">
            ({items.length})
          </span>
        </h2>
        <div className="space-y-3">{items.map(renderNotification)}</div>
      </div>
    );
  };

  const renderClearModal = () => {
    if (!showClearModal) return null;
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowClearModal(false)}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Clear All Notifications?
            </h2>
            <button
              onClick={() => setShowClearModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            This will permanently delete all {notifications.length}{" "}
            notification(s). This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowClearModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {clearing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Clearing...
                </>
              ) : (
                "Clear All"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Unable to Load Notifications
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Failed to load notifications.
          </p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-sm bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-slate-400 text-sm">
            Stay updated with messages from your hostel
          </p>
        </div>

        {/* Skeleton loading */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Filters */}
            {notifications.length > 0 && renderFilters()}

            {/* Actions */}
            {renderActions()}

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                  No Notifications Yet
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {filterType === NOTIFICATION_TYPES.ALL
                    ? "You're all caught up! No new notifications 📭"
                    : `No ${filterType} notifications found`}
                </p>
                {filterType !== NOTIFICATION_TYPES.ALL && (
                  <button
                    onClick={() => handleFilterChange(NOTIFICATION_TYPES.ALL)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notifications
                  </button>
                )}
              </div>
            ) : (
              <>
                {renderDateGroup("Today", groupedNotifications.today)}
                {renderDateGroup("Yesterday", groupedNotifications.yesterday)}
                {renderDateGroup("Older", groupedNotifications.older)}
              </>
            )}
          </>
        )}

        {/* Clear confirmation modal */}
        {renderClearModal()}
      </div>
    </div>
  );
};

export default Notifications;
