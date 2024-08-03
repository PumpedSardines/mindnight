import { Server } from "socket.io";
import * as db from "@/db";
import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();

type AttachBody = {
  gameId: string;
  playerId: string;
  token: string;
};

const attachBodySchema: JSONSchemaType<AttachBody> = {
  type: "object",
  properties: {
    gameId: { type: "string" },
    playerId: { type: "string" },
    token: { type: "string" },
  },
  required: ["gameId", "playerId", "token"],
  additionalProperties: false,
};

const validateAttachBody = ajv.compile(attachBodySchema);

function initSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("attach", (data) => {
      if (!validateAttachBody(data)) {
        return;
      }

      const { gameId, playerId, token } = data;

      const game = db.getGame(gameId);
      if (!game) {
        return;
      }

      const player = game.players.find((p) => p.id === playerId);
      if (!player || player.token !== token) {
        return;
      }

      console.log(`Player ${player.name} attached to game ${gameId}`);
      socket.join(gameId);
    });

    io.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
}

export default initSocket;
