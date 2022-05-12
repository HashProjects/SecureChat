import { Database } from "sqlite3";

const db = new Database(`${__dirname}/../../database/main.db`);

/**
 * This is a async/await wrapper for sqlite3 functions
 * @param {string} sql - the sql query
 * @param {any} params
 */
export const query = (sql: string, params?: any) => {
  return new Promise((res, rej) => {
    db.all(sql, params, (err: Error, rows: any[]) => {
      if (err) rej(err);
      res(rows);
    });
  });
};
