import { v4 as uuid } from "uuid";

class User {
  public name: string;
  public id: string;
  constructor(username: string, id?: string) {
    this.name = username;
    this.id = (!id) ? uuid() : id;
  }

  toString() {
    return `${this.name}<${this.id}>`;
  }
}

export default User;
