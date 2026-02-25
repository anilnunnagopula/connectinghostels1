import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext({
  unreadCount: 0,
  setUnreadCount: () => {},
  newRequestsCount: 0,
  setNewRequestsCount: () => {},
});

const SERVER_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role;

    if (!user || (role !== "student" && role !== "owner")) return;

    const socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (role === "student") {
        // Fetch current unread notification count on connect
        fetch(`${SERVER_URL}/api/student/notifications/unread-count`, {
          headers: { },
        })
          .then((r) => r.json())
          .then((data) => {
            if (typeof data.count === "number") setUnreadCount(data.count);
          })
          .catch(() => {});
      }
    });

    // Student: real-time notification badge updates
    socket.on("notification:new", ({ unreadCount: count }) => {
      if (typeof count === "number") setUnreadCount(count);
    });

    // Owner: new booking request badge
    socket.on("booking:new_request", () => {
      setNewRequestsCount((prev) => prev + 1);
    });

    // Student: payment confirmed in real time
    socket.on("payment:confirmed", ({ amount }) => {
      toast.success(
        amount
          ? `Payment of ₹${amount.toLocaleString("en-IN")} confirmed!`
          : "Payment confirmed!"
      );
    });

    // Room availability changed (no UI action — page will refetch on next load)
    socket.on("room:availability_changed", () => {});

    socket.on("connect_error", () => {
      // Silent — polling fallback handles it
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SocketContext.Provider
      value={{ unreadCount, setUnreadCount, newRequestsCount, setNewRequestsCount }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
