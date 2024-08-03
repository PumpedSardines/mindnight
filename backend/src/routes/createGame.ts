import { Express } from "express";
import randomId from "@/shared/randomId";
import * as db from "@/db";
import resForger from "@/utils/res";
import { newEmptyGame } from "@/shared/Game";

function createGame(app: Express) {
  app.post("/api/game", (_, res) => {
    const forge = resForger(res);
    let gameId = randomId(6);
    while (db.getGame(gameId) !== null) {
      gameId = randomId(6);
    }

    const game = newEmptyGame(gameId, randomId(256));
    // HACK: For debugging
    game.metaGameData.minPlayers = 1;
    game.metaGameData.amountOfHackers = 1;

    // game.metaGameData.proposingTimeout = 1000 * 60 * 60 * 24;
    // game.metaGameData.proposalVoteTimeout = 1000 * 60 * 60 * 24;
    // game.metaGameData.proposalVoteResultTimeout = 2;
    // game.metaGameData.missionTimeout = 1000 * 60 * 60 * 24;
    // game.metaGameData.missionResultTimeout = 2;

    db.setGame(gameId, game);

    forge(200, {
      msg: "ok",
      payload: {
        gameId: game.id,
        adminToken: game.adminToken,
      },
    });
  });
}

export default createGame;
