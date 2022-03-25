import express, { Express, json } from "express";
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { INVERSIFY_TYPES } from "./config/inversify.types";
import { LoggerService } from "./logger/logger.service";
import cors from "cors";
import {
  removeAllMessages,
  removeUser,
  getMessages,
  getUsers,
  updateMessages,
  updateUsers
} from "./database/database";
export const PORT = process.env.PORT || "5000";

const CHAT_VALUE = {
  users: "users",
  messages: "messages"
}

const ROOT = "MAIN";

@injectable()
export class App {
  app: Express;
  port: string;
  server: HttpServer;
  io: Server;

  constructor(
    @inject(INVERSIFY_TYPES.LoggerService) private LoggerService: LoggerService) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, { cors: { origin: '*' } });
    this.port = PORT;
  }

  useRoutes() {
    this.app.get('/root', this.rootRouter)
  }

  rootRouter(_: unknown, res: express.Response) {
    res.json({
      [CHAT_VALUE.users]: getUsers(),
      [CHAT_VALUE.messages]: getMessages(),
    });
  }

  useJson(): void {
    this.app.use(json());
  }

  useCors(): void {
    this.app.use(
      cors({
        credentials: true,
        origin: `*`,
      }),
    );
  }

  useConnected(): void {
    this.io.on("connection", this.connection);
  }

  private connection(socket: Socket) {
    console.log("SOCKET CONNECTED:", socket.id);
    socket.join(ROOT);

    socket.on("JOINED", ({ username, uid }) => {
      const newUser = { username, uid, socketId: socket.id };
      updateUsers(newUser);
      socket.to(ROOT).emit("SET_USERS", newUser);
    });

    socket.on("SEND_MESSAGE", ({ message, user, _id }) => {
      const newMessage = { message, user, _id };

      updateMessages(newMessage);
      socket.to(ROOT).emit("SET_MESSAGE", newMessage);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      socket.to(ROOT).emit("USER_DISCONNECT", getUsers());

      if (getUsers().length === 0) removeAllMessages();
    })
  }

  init(): void {
    this.useJson();
    this.useCors();
    this.useRoutes();
    this.useConnected();
    this.server.listen(this.port);
    this.LoggerService.info(`Запущен сервер на ${PORT} порту.`);
  }
}
