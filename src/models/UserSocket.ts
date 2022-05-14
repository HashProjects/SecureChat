import { Socket } from "socket.io";

export default interface UserSocket extends Socket {
  user: {
    name: string;
    id: string;
  };
}
