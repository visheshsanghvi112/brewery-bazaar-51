import { db } from "@/integrations/firebase/client";
import { collection, addDoc } from "firebase/firestore";

export enum LogSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}

interface LogEntry {
  message: string;
  context: Record<string, any>;
  severity: LogSeverity;
  timestamp: string;
  url: string;
  userAgent: string;
}

/**
 * Robust Logger for Production E-Commerce.
 * Pushes critical errors to Firestore and logs locally based on severity.
 */
export const Logger = {
  async log(severity: LogSeverity, message: string, context: Record<string, any> = {}) {
    const entry: LogEntry = {
      message,
      context,
      severity,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "Server",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "Unknown"
    };

    // Console Logging based on severity
    if (severity === LogSeverity.INFO) {
      console.log(`[ℹ️ INFO] ${message}`, context);
    } else if (severity === LogSeverity.WARNING) {
      console.warn(`[⚠️ WARN] ${message}`, context);
    } else {
      console.error(`[🚨 ${severity.toUpperCase()}] ${message}`, context);
    }

    // Only persist WARNING or higher to the DB to prevent bloat
    if (severity === LogSeverity.ERROR || severity === LogSeverity.CRITICAL) {
      try {
        await addDoc(collection(db, "system_logs"), entry);
      } catch (err) {
        // Fallback if DB fails to log
        console.error("🔥 FAILED TO PERSIST CRITICAL LOG EXCEPTION:", err, entry);
      }
    }
  },

  info(msg: string, ctx?: Record<string, any>) {
    this.log(LogSeverity.INFO, msg, ctx);
  },

  warn(msg: string, ctx?: Record<string, any>) {
    this.log(LogSeverity.WARNING, msg, ctx);
  },

  error(msg: string, ctx?: Record<string, any>) {
    this.log(LogSeverity.ERROR, msg, ctx);
  },

  critical(msg: string, ctx?: Record<string, any>) {
    this.log(LogSeverity.CRITICAL, msg, ctx);
  }
};
