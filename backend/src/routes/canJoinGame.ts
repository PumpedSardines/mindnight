import { Express } from "express";
import * as db from "@/db";
import resForger from "@/utils/res";

function joinGame(app: Express) {
  app.get("/api/game/:gameId/can-join", (req, res) => {
    const forge = resForger(res);
    const gameId = req.params.gameId;

    const game = db.getGame(gameId);

    if (!game) {
      return forge(404, { msg: "Game not found" });
    }

    if (game.state !== "lobby") {
      return forge(403, { msg: "Game has already started" });
    }

    forge(200, { msg: "ok" });
  });
}

export default joinGame;
