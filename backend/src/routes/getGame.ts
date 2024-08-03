import { Express } from "express";
import * as db from "@/db";
import { sanitizeGame } from "@/utils/sanitize";
import resForger from "@/utils/res";

/**
 * Gets the state of a game
 */
function getGame(app: Express) {
  app.get("/api/game/:gameId", (req, res) => {
    const forge = resForger(res);
    const token = req.headers.authorization;
    const gameId = req.params.gameId;

    const game = db.getGame(gameId);

    if (!game) {
      return forge(404, { msg: "Game not found" });
    }

    const player = game.players.find((p) => p.token === token);
    if (!player) {
      return forge(403, { msg: "Forbidden" });
    }

    forge(200, { msg: "ok", payload: sanitizeGame(player)(game) });
  });
}

export default getGame;
