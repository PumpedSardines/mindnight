import { Express } from "express";
import randomId from "@/shared/randomId";
import getDb from "@/db";
import resForger from "@/utils/res";
import { newEmptyGame } from "@/shared/Game";

function createGame(app: Express) {
  app.post("/api/game", async (_, res) => {
    const forge = resForger(res);
    console.log("createGame");

    const prisma = res.locals["prisma"];
    const db = getDb(prisma);

    let gameId = randomId(6);
    await db.idExists(gameId);
    while (await db.idExists(gameId)) {
      gameId = randomId(6);
    }

    const game = newEmptyGame(gameId, randomId(256));

    await db.setGame(gameId, game);

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
