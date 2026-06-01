import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const RealTimeContext = createContext(null);

export const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    
    const playTone = (freq, type, startTime, duration, vol) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    const now = audioCtx.currentTime;
    // Premium dual-tone chime (A5 then C#6)
    playTone(880, "sine", now, 0.35, 0.2);
    playTone(1760, "sine", now, 0.2, 0.06);
    
    playTone(1109, "sine", now + 0.12, 0.45, 0.18);
    playTone(2218, "sine", now + 0.12, 0.25, 0.05);
  } catch (error) {
    console.error("Audio synth error:", error);
  }
};

export const RealTimeProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const listeners = useRef({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
      : "http://localhost:5000";

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Fallback automatically to long-polling
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Real-time Socket connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Real-time Socket disconnected");
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.warn("Real-time Socket connection error:", error);
    });

    socket.on("data_updated", (payload) => {
      console.log("Real-time update received:", payload);
      const { type, action } = payload;
      
      // Play sound for new creation events (only if user is on dashboard routes)
      if (action === "create" && window.location.pathname.startsWith("/dashboard")) {
        playNotificationSound();
      }

      // Trigger listeners for this type
      if (listeners.current[type]) {
        listeners.current[type].forEach((cb) => {
          try {
            cb(payload);
          } catch (e) {
            console.error("Error executing socket callback:", e);
          }
        });
      }

      // Trigger global generic listeners
      if (listeners.current["*"]) {
        listeners.current["*"].forEach((cb) => {
          try {
            cb(payload);
          } catch (e) {
            console.error("Error executing global socket callback:", e);
          }
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
    };
  }, [user]);

  const subscribe = (type, callback) => {
    if (!listeners.current[type]) {
      listeners.current[type] = [];
    }
    listeners.current[type].push(callback);
    return () => {
      listeners.current[type] = listeners.current[type].filter((cb) => cb !== callback);
    };
  };

  return (
    <RealTimeContext.Provider value={{ connected, subscribe, playSound: playNotificationSound }}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error("useRealTime must be used within a RealTimeProvider");
  }
  return context;
};
