import { Server } from "socket.io";
import Ajv, { JSONSchemaType } from "ajv";
import { PrismaClient } from "@prisma/client";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

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

function initSocket(io: Server, prisma: PrismaClient) {
  io.on("connection", (socket) => {
    socket.on("attach", async (data) => {
      if (!validateAttachBody(data)) {
        return;
      }

      const { gameId, token } = data;

      const gameHandler = await getGameHandlerFromId(gameId, prisma);

      const player = gameHandler?.getPlayerFromToken(token);
      if (!player) {
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
