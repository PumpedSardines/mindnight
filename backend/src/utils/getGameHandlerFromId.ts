import { getGameHandler } from "@/shared/Game";
import { sanitizeGame } from "@/utils/sanitize";
import { Game, Player } from "@/shared/types";
import { PrismaClient } from "@prisma/client";
import getDb from "@/db";

async function getGameHandlerFromId(
  id: string,
  prisma: PrismaClient,
): Promise<
  | (ReturnType<typeof getGameHandler> & {
      save: () => Promise<void>;
      getSanitizedGame(player: Player): Game;
    })
  | null
> {
  const db = getDb(prisma);

  const rawGame = await db.getGame(id);

  if (!rawGame) {
    return null;
  }

  const handler = getGameHandler(rawGame);

  return {
    ...handler,
    getSanitizedGame(player: Player) {
      return sanitizeGame(player)(handler.game);
    },
    async save() {
      await db.setGame(id, handler.game);
    },
  };
}

export default getGameHandlerFromId;
