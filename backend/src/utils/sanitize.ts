import { Game, Player } from "@/shared/types";

export function sanitizeGame(player: Player): (game: Game) => Game {
  return (game: Game) =>
    ({
      id: game.id,
      state: game.state,
      players: game.players.map(sanitizePlayer(game, player)),
      metaGameData: game.metaGameData,
      timestampNextPhase: game.timestampNextPhase,
      phase: game.phase,
      mission: game.mission,
      missions: game.missions,
      playerProposingMission: game.playerProposingMission,
      proposedPlayersIds: game.proposedPlayersIds,
      proposalVotes:
        game.phase === "proposal-vote"
          ? Object.fromEntries(
              Object.entries(game.proposalVotes).map(([k, _]) => [k, false]),
            )
          : game.proposalVotes,
      missionPlayers: Object.fromEntries(
        Object.entries(game.missionPlayers).map(([k, v]) => {
          const isMe = k === player.id;

          return [
            k,
            {
              playerId: v.playerId,
              answered: isMe ? v.answered : false,
              hacked: isMe ? v.hacked : false,
            },
          ];
        }),
      ),
    }) as Game;
}

export function sanitizePlayer(
  game: Game,
  player: Player,
): (player: Player) => Player {
  const showHacker = game.state === "game-over" || player.hacker;

  return (p: Player) =>
    ({
      id: p.id,
      name: p.name,
      admin: p.admin,
      hacker: showHacker ? p.hacker : false,
      character: p.character,
    }) as Player;
}
