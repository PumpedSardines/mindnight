import { getGameHandler } from "./Game";

export type CharacterBody = "circle" | "rhombus" | "square" | "squircle";
export type CharacterColor =
  | "blue"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "yellow";
export type CharacterFace =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l";

export type Character = {
  body: CharacterBody;
  color: CharacterColor;
  face: CharacterFace;
};

export type Player = {
  id: string;
  admin: boolean;
  token: string; // Will not be sent to the client
  name: string; // Will be set to false if the player is a hacker
  hacker: boolean;
  character: Character;
};

export type GameHandler = ReturnType<typeof getGameHandler>;

export type Game = {
  id: string;
  metaGameData: {
    minPlayers: number;
    maxPlayers: number;
    amountOfHackers: number;
    needsMoreThan50Percent: boolean;
    proposingTimeout: number;
    proposalVoteTimeout: number;
    proposalVoteResultTimeout: number;
    missionTimeout: number;
    missionResultTimeout: number;
  };
  timestampNextPhase: number;
  // Will not be sent to the client
  adminToken: string;
  state: "lobby" | "playing" | "game-over";
  phase:
  | "propose"
  | "proposal-vote"
  | "proposal-vote-result"
  | "mission"
  | "mission-result";
  mission: number;
  missions: { done: boolean; hackedVotes: number; people: number }[];
  playerProposingMission: string;
  proposedPlayersIds: string[];
  proposalVotes: {
    [playerId: string]: boolean;
  };
  missionPlayers: {
    [playerId: string]: {
      playerId: string;
      answered: boolean;
      hacked: boolean;
    };
  };

  players: Player[];
};
