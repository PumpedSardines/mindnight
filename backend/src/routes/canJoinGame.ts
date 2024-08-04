import { Express } from "express";
import resForger from "@/utils/res";
import { PrismaClient } from "@prisma/client";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

function joinGame(app: Express) {
  app.get("/api/game/:gameId/can-join", async (req, res) => {
    const forge = resForger(res);

    const prisma = res.locals["prisma"] as PrismaClient;

    const gameId = req.params.gameId;

    const gameHandle = await getGameHandlerFromId(gameId, prisma);

    if (!gameHandle) {
      return forge(404, { msg: "Game not found" });
    }

    if (!gameHandle.isLobby()) {
      return forge(403, { msg: "Game has already started" });
    }

    forge(200, { msg: "ok" });
  });
}

export default joinGame;
