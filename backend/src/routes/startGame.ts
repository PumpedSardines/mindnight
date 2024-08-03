import { Express } from "express";
import resForger from "@/utils/res";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import registerTimeOut from "@/utils/registerGameTimeout";

/**
 * Gets the state of a game
 */
function startGame(app: Express, io: Server) {
  app.post("/api/game/:gameId/start", (req, res) => {
    const forge = resForger(res);

    const gameId = req.params.gameId;
    const token = req.headers.authorization;

    const gameHandler = getGameHandlerFromId(gameId);
    if (!gameHandler) {
      return forge(404, { msg: "Game not found" });
    }

    const player = gameHandler.getPlayerFromToken(token);
    const isAdmin = player?.admin ?? false;
    if (!isAdmin) {
      return forge(403, { msg: "Forbidden" });
    }

    if (!gameHandler.isLobby()) {
      return forge(400, { msg: "Game has already started" });
    }

    if (gameHandler.isPlayerCountTooLow()) {
      return forge(400, { msg: "Not enough players" });
    }

    if (gameHandler.isPlayerCountTooHigh()) {
      return forge(400, { msg: "Not enough players" });
    }

    gameHandler.startGame();
    gameHandler.save();
    io.to(gameId).emit("update");
    registerTimeOut(gameHandler.gameId(), io, gameHandler.getTimeLeft());

    forge(200, { msg: "ok" });
  });
}

export default startGame;
