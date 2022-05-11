import config from "./config";
import logger from "node-color-log";

logger.setLevel(config.logLevel);

const success = (namespace: string, message: string, object?: any) => {
  logger.success(`[${namespace}] ${message}`, object ?? '');
};

const info = (namespace: string, message: string, object?: any) => {
  logger.info(`[${namespace}] ${message}`, object ?? '');
};

const warn = (namespace: string, message: string, object?: any) => {
  logger.warn(`[${namespace}] ${message}`, object ?? '');
};

const debug = (namespace: string, message: string, object?: any) => {
  logger.debug(`[${namespace}] ${message}`, object ?? '');
};

const error = (namespace: string, message: string, object?: any) => {
  logger.error(`[${namespace}] ${message}`, object ?? '');
};

export default {
  success,
  info,
  warn,
  debug,
  error,
};
