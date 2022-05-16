import config from "../config/config";
import path from "path";

export const dir = (file: string) => {
  return path.join(config.rootDir + "/public/" + file);
};