import { v4 as uuid } from "uuid";

class User {
  public name: string;
  public id: string;
  constructor(username: string) {
    this.name = username;
    this.id = uuid();
  }

  toString() {
    return `${this.name}<${this.id}>`;
  }
}

export default User;
