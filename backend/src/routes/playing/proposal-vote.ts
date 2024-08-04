import { Express } from "express";
import resForger from "@/utils/res";
import Ajv, { JSONSchemaType } from "ajv";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import { PrismaClient } from "@prisma/client";

const ajv = new Ajv();

type Body = {
  accept: boolean;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    accept: { type: "boolean" },
  },
  required: ["accept"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function proposeVote(app: Express) {
  app.post("/api/game/:gameId/playing/propose-vote", async (req, res) => {
    const forge = resForger(res);

    const io = res.locals["io"] as Server;
    const prisma = res.locals["prisma"] as PrismaClient;

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

    if (!gameHandler.isPhase("proposal-vote")) {
      return forge(400, { msg: "Not the right phase" });
    }

    gameHandler.voteProposal(player.id, body.accept);
    await gameHandler.save();
    io.to(gameId).emit("update");

    forge(200, {
      msg: "ok",
    });
  });
}

export default proposeVote;
