import { Server } from "socket.io";
import getGameHandlerFromId from "@/utils/getGameHandlerFromId";

const timeouts = new Map<string, NodeJS.Timeout>();

function registerTimeOut(gameId: string, io: Server, timeout: number) {
  const id = timeouts.get(gameId);
  if (id != null) {
    clearTimeout(id);
  }
  timeouts.set(
    gameId,
    setTimeout(() => {
      const gameHandler = getGameHandlerFromId(gameId);

      if (!gameHandler) {
        return;
      }

      const needsUpdate = gameHandler.handleTimeout();
      if (needsUpdate) {
        gameHandler.save();
        io.to(gameId).emit("update");
        registerTimeOut(gameId, io, gameHandler.getTimeLeft());
      }
    }, timeout),
  );
}

export default registerTimeOut;
