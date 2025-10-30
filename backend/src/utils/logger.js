/**
 * Simple logger utility
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  console.log(prefix, message, ...args);
}

module.exports = {
  info: (msg, ...args) => log('INFO', `${colors.blue}${msg}${colors.reset}`, ...args),
  success: (msg, ...args) => log('SUCCESS', `${colors.green}${msg}${colors.reset}`, ...args),
  warn: (msg, ...args) => log('WARN', `${colors.yellow}${msg}${colors.reset}`, ...args),
  error: (msg, ...args) => log('ERROR', `${colors.red}${msg}${colors.reset}`, ...args)
};

