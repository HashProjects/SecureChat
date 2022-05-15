import { Request } from "express";

export default interface UserSocket extends Request {
  user: {
    name: string;
    id: string;
  };
}