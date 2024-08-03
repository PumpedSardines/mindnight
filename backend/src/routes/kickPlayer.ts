import { Express } from "express";
import resForger from "@/utils/res";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

function kickPlayer(app: Express, io: Server) {
  app.delete("/api/game/:gameId/player/:playerId", (req, res) => {
    const forge = resForger(res);

    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const token = req.headers.authorization;

    const gameHandler = getGameHandlerFromId(gameId);

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
    gameHandler.save();

    io.to(gameId).emit("kick", { playerId });
    io.to(gameId).emit("update");

    forge(200, { msg: "ok" });
  });
}

export default kickPlayer;
