import { v4 as uuid } from "uuid";

class User {
  public username: string;
  public id: string;
  constructor(username: string) {
    this.username = username;
    this.id = uuid();
  }

  toString() {
    return `${this.username}<${this.id}>`;
  }
}

export default User;
