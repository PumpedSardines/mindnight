import { Express } from "express";
import resForger from "@/utils/res";
import Ajv, { JSONSchemaType } from "ajv";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import { PrismaClient } from "@prisma/client";

const ajv = new Ajv();

type Body = {
  playersIds: string[];
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    playersIds: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["playersIds"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function propose(app: Express) {
  app.post("/api/game/:gameId/playing/propose", async (req, res) => {
    const forge = resForger(res);

    const prisma = res.locals["prisma"] as PrismaClient;
    const io = res.locals["io"] as Server;

    const gameId = req.params.gameId;
    const token = req.headers.authorization;
    const body = req.body;

    if (!validate(body)) {
      return forge(400, { msg: "Invalid body" });
    }

    const gameHandler = await getGameHandlerFromId(gameId, prisma);
    if (!gameHandler) {
      return forge(404, { msg: "Game not found" });
    }

    const player = gameHandler.getPlayerFromToken(token);
    if (!player) {
      return forge(403, { msg: "Forbidden" });
    }

    if (!gameHandler.isPlaying()) {
      return forge(400, { msg: "Game has not started" });
    }

    if (!gameHandler.isPhase("propose")) {
      return forge(400, { msg: "Not the right phase" });
    }

    if (!gameHandler.isProposingPlayer(player)) {
      return forge(400, { msg: "Not your turn" });
    }

    const playersIds = body.playersIds;

    if (playersIds.length !== gameHandler.currentMissionPlayersCount()) {
      return forge(400, { msg: "Invalid amount of players" });
    }

    if (!gameHandler.areValidPlayersIds(playersIds)) {
      return forge(400, { msg: "Invalid players" });
    }

    gameHandler.propose(playersIds);
    await gameHandler.save();
    io.to(gameId).emit("update");

    forge(200, {
      msg: "ok",
    });
  });
}

export default propose;
