type LogLevel = 'info' | 'warn' | 'error' | 'security';

export function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  }

  // In production, this could send to a logging service like Axiom, Datadog, or Sentry
  console.log(JSON.stringify(logEntry))
}

export const logger = {
  info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
  error: (msg: string, data?: Record<string, unknown>) => log('error', msg, data),
  security: (msg: string, data?: Record<string, unknown>) => log('security', msg, data),
}
