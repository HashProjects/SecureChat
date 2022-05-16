import { v4 as uuid } from "uuid";
import User from "./User";

class ChatRoom {
  public users: User[];
  public id: string;
  constructor(users: User[], id?: string) {
    this.users = users;
    this.id = !id ? uuid() : id;
  }
}

export default ChatRoom;
