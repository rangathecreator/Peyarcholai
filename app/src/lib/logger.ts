/**
 * பெயர்ச்சோலை (Peyarcholai) — Production Structured Logging
 */

export interface LogPayload {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, unknown>;
  traceId?: string;
  timestamp?: string;
}

export function logEvent(payload: LogPayload) {
  const entry = {
    app: 'peyarcholai',
    timestamp: payload.timestamp || new Date().toISOString(),
    level: payload.level,
    message: payload.message,
    traceId: payload.traceId || undefined,
    ...payload.context,
  };

  const output = JSON.stringify(entry);
  if (payload.level === 'error') {
    console.error(output);
  } else if (payload.level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

