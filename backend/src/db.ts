import { Game } from "@/shared/types";
import { PrismaClient } from "@prisma/client";
import { EventEmitter } from "node:stream";

export const DbEventEmitter = new EventEmitter();

async function getGame(id: string, prisma: PrismaClient): Promise<Game | null> {
  const game = await prisma.game.findUnique({
    where: {
      id: id,
    },
  });

  if (!game) {
    return null;
  }

  return JSON.parse(game.data) as Game;
}

async function idExists(id: string, prisma: PrismaClient): Promise<boolean> {
  const game = await prisma.game.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
    },
  });

  return game !== null;
}

async function setGame(id: string, game: Game, prisma: PrismaClient) {
  await prisma.game.upsert({
    where: {
      id: id,
    },
    update: {
      timestampNextPhase: game.timestampNextPhase,
      state: game.state,
      data: JSON.stringify(game),
    },
    create: {
      id,
      timestampNextPhase: game.timestampNextPhase,
      state: game.state,
      data: JSON.stringify(game),
    },
  });
  DbEventEmitter.emit("setGame", id);
}

async function getExpiredPhaseGames(
  timestamp: number,
  prisma: PrismaClient,
): Promise<Game[]> {
  const games = await prisma.game.findMany({
    where: {
      timestampNextPhase: {
        lte: timestamp,
      },
      state: "playing",
    },
  });

  return games.map((game) => JSON.parse(game.data) as Game);
}

async function getNextExpiringGame(prisma: PrismaClient): Promise<Game | null> {
  const game = await prisma.game.findFirst({
    where: {
      state: "playing",
    },
    orderBy: {
      timestampNextPhase: "asc",
    },
  });

  if (!game) {
    return null;
  }

  return JSON.parse(game.data) as Game;
}

export default function getDb(prisma: PrismaClient) {
  return {
    idExists: (id: string) => idExists(id, prisma),
    getGame: (id: string) => getGame(id, prisma),
    setGame: (id: string, game: Game) => setGame(id, game, prisma),
    getNextExpiringGame: () => getNextExpiringGame(prisma),
    getExpiredPhaseGames: (timestamp: number) =>
      getExpiredPhaseGames(timestamp, prisma),
  };
}
