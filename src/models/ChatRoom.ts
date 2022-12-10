import { v4 as uuid } from "uuid";
import User from "./User";
var crypto = require("crypto");

const defaultName = (users: User[]) => {
  let name = "";
  // sort the user's names
  var sortedUsers: User[] = users.sort((u1,u2) => {
    if (u1.name > u2.name) {
      return 1;
    }

    if (u1.name < u2.name) {
      return -1;
    }
    return 0;
  });

  for (let user of sortedUsers) {
    name += user.name + ", ";
  }
  return name.slice(0, -2);
};

class ChatRoom {
  public users: User[];
  public id: string;
  public name: string;
  public key: string;
  public iv: string;
  constructor(users: User[], name?: string, id?: string, key?: string, iv?: string) {
    this.users = users;
    this.name = !name ? defaultName(users) : name;
    this.id = !id ? uuid() : id;
    // generate a random 32 bit key if not provided
    this.key = !key ? crypto.randomBytes(32).toString('hex') : key;
    this.iv = !iv ? crypto.randomBytes(16).toString('hex') : key
  }
}

export default ChatRoom;
