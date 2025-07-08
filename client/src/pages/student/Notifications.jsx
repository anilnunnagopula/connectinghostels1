import React from "react";
import { Bell, Megaphone, CheckCircle } from "lucide-react";

const dummyNotifications = [
  {
    type: "alert",
    message: "Mess will be closed tomorrow due to Dasara holidays.",
    time: "Just now",
  },
  {
    type: "info",
    message: "Your room rent is due by 5th July. Please clear dues.",
    time: "1 hour ago",
  },
  {
    type: "success",
    message: "You've been added to Anil Boys Hostel successfully!",
    time: "Yesterday",
  },
];

const iconMap = {
  alert: <Megaphone className="text-yellow-500" />,
  info: <Bell className="text-blue-500" />,
  success: <CheckCircle className="text-green-500" />,
};

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>

      {dummyNotifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No new notifications 📭
        </p>
      ) : (
        <div className="space-y-4">
          {dummyNotifications.map((note, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-start gap-4"
            >
              <div className="mt-1">{iconMap[note.type]}</div>
              <div>
                <p className="text-sm sm:text-base">{note.message}</p>
                <p className="text-xs text-gray-500 mt-1">{note.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
