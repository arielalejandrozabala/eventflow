// Structured logger — outputs JSON-compatible objects for easy ingestion
// by log aggregators (Datadog, Logtail, CloudWatch).
//
// In production, replace with Pino or Winston:
//   import pino from 'pino'
//   export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

type LogLevel = "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};
