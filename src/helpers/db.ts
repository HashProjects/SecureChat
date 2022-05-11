import { Database } from "sqlite3";

export const query = (db: Database, sql: string, params: any) => {
  return new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => {
      if (err) rej(err);
      res(rows);
    });
  });
};
