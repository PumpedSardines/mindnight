import { Express } from "express";
import randomId from "@/shared/randomId";
import * as db from "@/db";
import resForger from "@/utils/res";
import { newEmptyGame } from "@/shared/Game";

function createGame(app: Express) {
  app.post("/api/game", (_, res) => {
    const forge = resForger(res);
    let gameId = randomId(6);
    while (db.getGame(gameId) !== null) {
      gameId = randomId(6);
    }

    const game = newEmptyGame(gameId, randomId(256));

    db.setGame(gameId, game);

    forge(200, {
      msg: "ok",
      payload: {
        gameId: game.id,
        adminToken: game.adminToken,
      },
    });
  });
}

export default createGame;
