import { v4 as uuid } from "uuid";
import User from "./User";

const defaultName = (users: User[]) => {
  let name = "";
  for (let user of users) {
    name += user.name + ", ";
  }
  return name.slice(0, -2);
};

class ChatRoom {
  public users: User[];
  public id: string;
  public name: string;
  constructor(users: User[], name?: string, id?: string) {
    this.users = users;
    this.name = !name ? defaultName(users) : name;
    this.id = !id ? uuid() : id;
  }
}

export default ChatRoom;
