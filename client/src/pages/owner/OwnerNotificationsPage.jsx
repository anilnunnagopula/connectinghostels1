// src/pages/owner/OwnerNotificationsPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Bell,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Check,
} from "lucide-react";

const iconMap = {
  booking: <UserCheck className="text-purple-500" />,
  success: <CheckCircle className="text-green-500" />,
  info: <Bell className="text-blue-500" />,
  default: <MessageSquare className="text-slate-500" />,
};

const OwnerNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (error) {
      toast.error("Failed to refresh notifications.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch notifications on initial load and then poll every 30 seconds
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notifications/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Visually update the UI immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Could not mark notifications as read.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Activity Feed</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading activity...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg">
            <h2 className="text-xl font-semibold">All Caught Up!</h2>
            <p className="text-slate-500 mt-2">
              You have no new notifications 📭
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note._id}
                className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${
                  note.isRead
                    ? "bg-white dark:bg-slate-800"
                    : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                }`}
              >
                <div className="mt-1">
                  {iconMap[note.type] || iconMap.default}
                </div>
                <div>
                  <p>{note.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerNotificationsPage;
