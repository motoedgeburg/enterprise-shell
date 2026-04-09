/**
 * Lightweight structured logger.
 *
 * Every log entry includes a timestamp and the source tag passed to createLogger().
 * In production builds, debug-level messages are suppressed.
 *
 * Usage:
 *   import { createLogger } from '../utils/logger.js';
 *   const log = createLogger('AuthInitializer');
 *   log.error('start() failed', err);
 */

const IS_PRODUCTION = import.meta.env.PROD;

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = IS_PRODUCTION ? LEVELS.warn : LEVELS.debug;

function emit(level, source, message, extra) {
  if (LEVELS[level] < MIN_LEVEL) return;

  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info';

  // eslint-disable-next-line no-console
  console[method](`[${source}]`, message, ...(extra !== undefined ? [extra] : []));
}

export function createLogger(source) {
  return {
    debug: (message, extra) => emit('debug', source, message, extra),
    info: (message, extra) => emit('info', source, message, extra),
    warn: (message, extra) => emit('warn', source, message, extra),
    error: (message, extra) => emit('error', source, message, extra),
  };
}
