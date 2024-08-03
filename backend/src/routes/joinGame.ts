import { Express } from "express";
import Ajv, { JSONSchemaType } from "ajv";
import { Nullish } from "@/types";
import resForger from "@/utils/res";
import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

const ajv = new Ajv();
type Body = {
  name: string;
  adminToken?: Nullish<string>;
};

const schema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 10 },
    adminToken: { type: "string", nullable: true },
  },
  required: ["name"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function createGame(app: Express, io: Server) {
  app.post("/api/game/:gameId/join", (req, res) => {
    const forge = resForger(res);

    const gameId = req.params.gameId;
    const body = req.body;

    if (!validate(body)) {
      return forge(400, { msg: "Name must be between 3 and 10 characters" });
    }

    const { name, adminToken = null } = body;

    const gameHandler = getGameHandlerFromId(gameId);

    if (!gameHandler) {
      return forge(404, { msg: "Game not found" });
    }

    if (!gameHandler.isLobby()) {
      return forge(403, { msg: "Game has already started" });
    }

    if (gameHandler.isNameTaken(name)) {
      return forge(403, { msg: "Name already taken" });
    }

    const isAdmin =
      typeof adminToken === "string" &&
      gameHandler.verifyAdminToken(adminToken);
    const player = gameHandler.newPlayer(name, isAdmin);

    if (gameHandler.isPlayerCountTooHigh()) {
      return forge(400, { msg: "This lobby is already full" });
    }

    gameHandler.save();
    io.to(gameId).emit("update");

    const sanitizedGame = gameHandler.getSanitizedGame(player);

    return forge(200, {
      msg: "ok",
      payload: {
        playerId: player.id,
        token: player.token,
        gameId: sanitizedGame.id,
        game: sanitizedGame,
      },
    });
  });
}

export default createGame;
