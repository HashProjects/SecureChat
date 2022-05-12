import { Database } from "sqlite3";

const db = new Database(`${__dirname}/../../database/main.db`);

export const query = (sql: string, params?: any) => {
  return new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => {
      if (err) rej(err);
      res(rows);
    });
  });
};
