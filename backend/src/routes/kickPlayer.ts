import { Express } from "express";
import resForger from "@/utils/res";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import { PrismaClient } from "@prisma/client";

function kickPlayer(app: Express) {
  app.delete("/api/game/:gameId/player/:playerId", async (req, res) => {
    const forge = resForger(res);

    const prisma = res.locals["prisma"] as PrismaClient;
    const io = res.locals["io"] as Server;

    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const token = req.headers.authorization;

    const gameHandler = await getGameHandlerFromId(gameId, prisma);

    if (!gameHandler) {
      return forge(404, { msg: "Game not found" });
    }

    if (!gameHandler.isLobby()) {
      return forge(403, {
        msg: "Can't kick players after the game has started",
      });
    }

    const player = gameHandler.getPlayerFromToken(token);
    const isAdmin = player?.admin ?? false;
    if (!isAdmin) {
      return forge(403, { msg: "Forbidden" });
    }

    if (!gameHandler.getPlayer(playerId)) {
      return forge(404, { msg: "Player not found" });
    }

    gameHandler.kickPlayer(playerId);
    await gameHandler.save();

    io.to(gameId).emit("kick", { playerId });
    io.to(gameId).emit("update");

    forge(200, { msg: "ok" });
  });
}

export default kickPlayer;
