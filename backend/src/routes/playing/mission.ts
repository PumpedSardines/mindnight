import { Express } from "express";
import resForger from "@/utils/res";
import Ajv, { JSONSchemaType } from "ajv";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import { PrismaClient } from "@prisma/client";

const ajv = new Ajv();

type Body = {
  hack: boolean;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    hack: { type: "boolean" },
  },
  required: ["hack"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function mission(app: Express) {
  app.post("/api/game/:gameId/playing/mission", async (req, res) => {
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

    if (!gameHandler.isPhase("mission")) {
      return forge(400, { msg: "Not the right phase" });
    }

    if (!gameHandler.isInMission(player.id)) {
      return forge(400, { msg: "You are not in the mission" });
    }

    if (gameHandler.hasDoneMission(player.id)) {
      return forge(400, { msg: "You have already done the mission" });
    }

    gameHandler.doMission(player.id, body.hack);
    await gameHandler.save();
    io.to(gameId).emit("update");

    forge(200, {
      msg: "ok",
    });
  });
}

export default mission;
