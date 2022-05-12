import config from "./config";
import logger from "node-color-log";

logger.setLevel(config.logLevel);

export const success = (namespace: string, ...args: any[]) => {
  args.unshift(`[${namespace}]`);
  logger.success.apply(logger, args);
};

export const info = (namespace: string, ...args: any[]) => {
  args.unshift(`[${namespace}]`);
  logger.info.apply(logger, args);
};

export const warn = (namespace: string, ...args: any[]) => {
  args.unshift(`[${namespace}]`);
  logger.warn.apply(logger, args);
};

export const debug = (namespace: string, ...args: any[]) => {
  args.unshift(`[${namespace}]`);
  logger.debug.apply(logger, args);
};

export const error = (namespace: string, ...args: any[]) => {
  args.unshift(`[${namespace}]`);
  logger.error.apply(logger, args);
};

export default {
  success,
  info,
  warn,
  debug,
  error,
};
