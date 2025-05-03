import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "success" | "warning" | "error";
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    message: string,
    type: "info" | "success" | "warning" | "error"
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user) return;

    // Connect to the Socket.IO server
    const socketInstance = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("auth_token"),
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Listen for connection events
    socketInstance.on("connect", () => {
      console.log("Connected to notification server");

      // Join user-specific room
      socketInstance.emit("join", user._id);
    });

    // Listen for alerts
    socketInstance.on("alert", (message: string) => {
      const newNotification: Notification = {
        _id: Date.now().toString(),
        message,
        type: "info",
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [...prev, newNotification]);
      toast.info(message);
    });

    // Handle reconnection
    socketInstance.on("reconnect", (attemptNumber: number) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });

    // Handle disconnection
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from notification server");
    });

    // Handle errors
    socketInstance.on("connect_error", (error: Error) => {
      console.error("Connection error:", error);
      toast.error("Failed to connect to notification server");
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  // Fetch existing notifications on login
  useEffect(() => {
    const fetchExistingNotifications = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/alerts/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const alerts = await response.json();
        const formattedNotifications: Notification[] = alerts.map(
          (alert: any) => ({
            _id: alert._id,
            message: alert.message,
            type: "info",
            createdAt: alert.createdAt || new Date().toISOString(),
            read: false, // All notifications are unread when fetched
          })
        );

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    fetchExistingNotifications();
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const addNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error"
  ) => {
    const newNotification: Notification = {
      _id: Date.now().toString(),
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
    toast[type](message);
  };

  // Listen for alerts with deduplication
  useEffect(() => {
    if (!socket) return;

    const handleAlert = (message: string) => {
      const newNotification: Notification = {
        _id: Date.now().toString(),
        message,
        type: "info",
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => {
        // Check if we already have this exact message in the last minute
        const recentNotification = prev.find(
          (n) =>
            n.message === message &&
            new Date().getTime() - new Date(n.createdAt).getTime() < 60000
        );

        if (recentNotification) {
          return prev;
        }

        return [...prev, newNotification];
      });

      toast.info(message);
    };

    socket.on("alert", handleAlert);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        unreadCount: notifications.filter((n) => !n.read).length,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
