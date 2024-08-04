import { Express } from "express";
import resForger from "@/utils/res";
import { PrismaClient } from "@prisma/client";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

/**
 * Gets the state of a game
 */
function getGame(app: Express) {
  app.get("/api/game/:gameId", async (req, res) => {
    const prisma = res.locals["prisma"] as PrismaClient;

    const forge = resForger(res);
    const token = req.headers.authorization;
    const gameId = req.params.gameId;

    const game = await getGameHandlerFromId(gameId, prisma);

    if (!game) {
      return forge(404, { msg: "Game not found" });
    }

    const player = game.getPlayerFromToken(token);
    if (!player) {
      return forge(403, { msg: "Forbidden" });
    }

    forge(200, { msg: "ok", payload: game.getSanitizedGame(player) });
  });
}

export default getGame;
