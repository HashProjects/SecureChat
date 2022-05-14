import { Socket } from "socket.io";

export default interface UserSocket extends Socket {
  username: string,
  id: string
}