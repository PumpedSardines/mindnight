import * as express from "express";
import * as cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

import initSocket from "@/socket";

import createGame from "@/routes/createGame";
import joinGame from "@/routes/joinGame";
import getGame from "@/routes/getGame";
import canJoinGame from "@/routes/canJoinGame";
import updateCharacter from "./routes/updateCharacter";
import kickPlayer from "./routes/kickPlayer";
import startGame from "./routes/startGame";
import propose from "./routes/playing/propose";
import proposeVote from "./routes/playing/proposal-vote";
import mission from "./routes/playing/mission";
import getDb, { DbEventEmitter } from "./db";
import { getGameHandler as getGameHandler } from "./shared/Game";

const prisma = new PrismaClient();

// WARN: Currently there can be race conditions in almost every route
// I couldn't be bothered to fix this LOL.

(async () => {
  await prisma.$connect();

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  app.use(express.json());
  app.use(cors((_, callback) => callback(null, { origin: true })));
  app.use((_, res, next) => {
    res.locals["prisma"] = prisma;
    res.locals["io"] = io;
    next();
  });

  initSocket(io, prisma);

  createGame(app);
  getGame(app);
  canJoinGame(app);
  joinGame(app);
  updateCharacter(app);
  kickPlayer(app);
  startGame(app);
  propose(app);
  proposeVote(app);
  mission(app);

  let timeoutId: NodeJS.Timeout | null = null;

  async function updateTimeout() {
    const db = getDb(prisma);
    const nextExpiringGame = await db.getNextExpiringGame();

    if (!nextExpiringGame) {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const expiredGames = await db.getExpiredPhaseGames(Date.now());

      const promises = expiredGames.map(async (game) => {
        const gameHandle = getGameHandler(game);
        const needsUpdate = gameHandle.handleTimeout();

        if (needsUpdate) {
          await db.setGame(game.id, gameHandle.game);
          io.to(game.id).emit("update");
        }
      });

      await Promise.all(promises);
    }, nextExpiringGame.timestampNextPhase - Date.now());
  }

  updateTimeout();
  DbEventEmitter.on("setGame", () => {
    updateTimeout();
  });

  server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
  });
})();
