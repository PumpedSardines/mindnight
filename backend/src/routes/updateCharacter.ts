import { Express } from "express";
import resForger from "@/utils/res";
import Ajv, { JSONSchemaType } from "ajv";
import { characterSchema } from "@/shared/schemas";
import { Character } from "@/shared/types";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";
import { PrismaClient } from "@prisma/client";

const ajv = new Ajv();
type Body = {
  character: Character;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    character: characterSchema,
  },
  required: ["character"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function updateCharacter(app: Express) {
  app.post("/api/game/:gameId/character", async (req, res) => {
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

    if (!gameHandler.isLobby()) {
      return forge(403, {
        msg: "Can't change a character when the game has started",
      });
    }

    const player = gameHandler.getPlayerFromToken(token);
    if (!player) {
      return forge(403, { msg: "Forbidden" });
    }
    gameHandler.setPlayerCharacter(player.id, body.character);
    await gameHandler.save();

    io.to(gameId).emit("update", { debounce: 300 });

    forge(200, { msg: "ok" });
  });
}

export default updateCharacter;
