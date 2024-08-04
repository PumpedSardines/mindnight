import shuffle from "@/shared/shuffle";
import { Character, Game, Player } from "./types";
import { randomCharacter } from "./randomCharacter";
import randomId from "./randomId";

export function newEmptyGame(gameId: string, adminToken: string): Game {
  const game: Game = {
    id: gameId,
    metaGameData: {
      minPlayers: 5,
      maxPlayers: 10,
      amountOfHackers: 2,
      needsMoreThan50Percent: false,
      proposingTimeout: 120,
      proposalVoteTimeout: 90,
      proposalVoteResultTimeout: 5,
      missionTimeout: 30,
      missionResultTimeout: 5,
    },
    timestampNextPhase: 0,
    adminToken,
    state: "lobby",
    phase: "propose",
    mission: 0,
    missions: [
      { done: false, hackedVotes: 0, people: 2 },
      { done: false, hackedVotes: 0, people: 3 },
      { done: false, hackedVotes: 0, people: 2 },
      { done: false, hackedVotes: 0, people: 3 },
      { done: false, hackedVotes: 0, people: 3 },
    ],
    playerProposingMission: "",
    proposedPlayersIds: [],
    proposalVotes: {},
    missionPlayers: {},
    players: [],
  };

  return game;
}

// Combo OOP and functional monstrosity lmao

export function getGameHandler(game: Game) {
  const newGame = JSON.parse(JSON.stringify(game)) as Game;

  return {
    game: newGame,
    gameId() {
      return this.game.id;
    },
    load(data: Game) {
      Object.assign(this.game, data);
    },
    getPlayerFromToken(token: unknown) {
      if (typeof token !== "string") {
        return null;
      }
      return this.game.players.find((p) => p.token === token) ?? null;
    },
    getPlayer(playerId: string) {
      return this.game.players.find((p) => p.id === playerId) ?? null;
    },
    kickPlayer(playerId: string) {
      if (!this.isLobby()) {
        throw new Error("Game has already started");
      }

      if (!this.getPlayer(playerId)) {
        throw new Error("Player not found");
      }

      this.game.players = this.game.players.filter((p) => p.id !== playerId);
    },
    verifyAdminToken(adminToken: string) {
      return this.game.adminToken === adminToken;
    },
    isLobby() {
      return this.game.state === "lobby";
    },
    isPlaying() {
      return this.game.state === "playing";
    },
    isNameTaken(name: string) {
      return this.game.players.some((p) => p.name === name);
    },
    isGameOver() {
      return this.game.state === "game-over";
    },
    isPlayerCountTooLow() {
      return this.game.players.length < this.game.metaGameData.minPlayers;
    },
    isPlayerCountTooHigh() {
      return this.game.players.length > this.game.metaGameData.maxPlayers;
    },
    areValidPlayersIds(playersIds: string[]) {
      return playersIds.every((p) =>
        this.game.players.some((pl) => pl.id === p),
      );
    },
    setPlayerCharacter(playerId: string, character: Character) {
      const player = this.game.players.find((p) => p.id === playerId);
      if (!player) {
        throw new Error("Player not found");
      }
      player.character = character;
    },
    newPlayer(name: string, isAdmin = false) {
      if (!this.isLobby()) {
        throw new Error("Game has already started");
      }

      if (this.isNameTaken(name)) {
        throw new Error("Name already taken");
      }

      const player = {
        id: randomId(256),
        admin: isAdmin,
        token: randomId(256),
        name,
        hacker: false,
        character: randomCharacter(),
      };

      this.game.players.push(player);
      return player;
    },
    canStartGame() {
      return (
        this.isLobby() &&
        !this.isPlayerCountTooLow() &&
        !this.isPlayerCountTooHigh()
      );
    },
    startGame() {
      if (!this.isLobby()) {
        throw new Error("Game has already started");
      }

      if (this.isPlayerCountTooLow()) {
        throw new Error("Not enough players");
      }

      if (this.isPlayerCountTooHigh()) {
        throw new Error("Too many players");
      }

      this.game.state = "playing";
      const playerIndexes = shuffle(this.game.players.map((_, i) => i));
      let amountOfHackers = this.game.metaGameData.amountOfHackers;
      while (amountOfHackers > 0) {
        this.game.players[playerIndexes.pop()!]!.hacker = true;
        amountOfHackers--;
      }
      this.game.players = shuffle(this.game.players);
      this.game.state = "playing";
      this.game.phase = "propose";
      this.game.timestampNextPhase =
        Date.now() + this.game.metaGameData.proposingTimeout * 1000;
      this.game.mission = 0;
      this.game.missions = [
        { done: false, hackedVotes: 0, people: 1 },
        { done: false, hackedVotes: 0, people: 2 },
        { done: false, hackedVotes: 0, people: 1 },
        { done: false, hackedVotes: 0, people: 2 },
        { done: false, hackedVotes: 0, people: 2 },
      ];
      this.game.playerProposingMission = this.game.players[0]!.id;
    },
    currentMissionPlayersCount() {
      return this.game.missions[this.game.mission]!.people;
    },
    isPhase(phase: Game["phase"]) {
      return this.game.phase === phase;
    },
    isProposingPlayer(data: string | Player) {
      const id = typeof data === "string" ? data : data.id;
      return this.game.playerProposingMission === id;
    },
    propose(playersIds: string[]) {
      if (!this.isPlaying()) {
        throw new Error("Game has not started");
      }

      if (!this.isPhase("propose")) {
        throw new Error("Not the right phase");
      }

      if (playersIds.length !== this.currentMissionPlayersCount()) {
        throw new Error("Wrong amount of players");
      }

      this.game.proposedPlayersIds = playersIds;
      this.game.missionPlayers = {};
      this.game.proposalVotes = {};
      this.game.phase = "proposal-vote";

      this.game.timestampNextPhase =
        Date.now() + this.game.metaGameData.proposalVoteTimeout * 1000;
    },
    voteProposal(playerId: string, accept: boolean) {
      if (!this.isPlaying()) {
        throw new Error("Game has not started");
      }

      if (!this.isPhase("proposal-vote")) {
        throw new Error("Not the right phase");
      }

      this.game.proposalVotes[playerId] = accept;

      if (this.hasEveryoneVoted()) {
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.proposalVoteResultTimeout * 1000;
        this.proposalVoteResult();
      }
    },
    hasEveryoneVoted() {
      return (
        Object.keys(this.game.proposalVotes).length === this.game.players.length
      );
    },
    didProposalPass() {
      if (!this.hasEveryoneVoted()) {
        throw new Error("Not everyone has voted");
      }

      const acceptVotes = Object.values(this.game.proposalVotes).filter(
        Boolean,
      ).length;
      const votes = Object.values(this.game.proposalVotes).length;
      if (this.game.metaGameData.needsMoreThan50Percent) {
        return acceptVotes > votes / 2;
      } else {
        return acceptVotes >= votes / 2;
      }
    },
    nextProposerPlayer() {
      let nextProposerIndex =
        this.game.players.findIndex(
          (p) => p.id === this.game.playerProposingMission,
        ) + 1;
      if (nextProposerIndex === this.game.players.length) {
        nextProposerIndex = 0;
      }
      return game.players[nextProposerIndex]!;
    },
    proposalVoteResult() {
      if (!this.isPhase("proposal-vote")) {
        throw new Error("Not the right phase");
      }

      if (!this.hasEveryoneVoted()) {
        throw new Error("Not everyone has voted");
      }

      this.game.phase = "proposal-vote-result";
    },
    hasEveryoneDoneMission() {
      return Object.values(this.game.missionPlayers).every((p) => p.answered);
    },
    isInMission(playerId: string) {
      return playerId in this.game.missionPlayers;
    },
    hasDoneMission(playerId: string) {
      return this.game.missionPlayers[playerId]!.answered;
    },
    doMission(playerId: string, hack: boolean) {
      if (!this.isPlaying()) {
        throw new Error("Game has not started");
      }

      if (!this.isPhase("mission")) {
        throw new Error("Not the right phase");
      }

      if (!this.isInMission(playerId)) {
        throw new Error("Not in mission");
      }

      this.game.missionPlayers[playerId]!.answered = true;
      this.game.missionPlayers[playerId]!.hacked = hack;

      if (this.hasEveryoneDoneMission()) {
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.missionResultTimeout * 1000;
        this.missionResult();
      }
    },
    hasAnyoneWon(): "hackers" | "agents" | null {
      const hacked = this.game.missions.filter(
        (v) => v.done && v.hackedVotes > 0,
      ).length;
      const fulfilled = this.game.missions.filter(
        (v) => v.done && v.hackedVotes == 0,
      ).length;

      if (hacked >= 3) {
        return "hackers";
      } else if (fulfilled >= 3) {
        return "agents";
      } else {
        return null;
      }
    },
    missionResult() {
      if (!this.isPhase("mission")) {
        throw new Error("Not the right phase");
      }

      if (!this.hasEveryoneDoneMission()) {
        throw new Error("Not everyone has done the mission");
      }

      this.game.missions[this.game.mission]!.done = true;
      this.game.missions[this.game.mission]!.hackedVotes = Object.values(
        this.game.missionPlayers,
      ).filter((p) => p.hacked).length;
      this.game.mission = Math.min(
        this.game.missions.length - 1,
        this.game.mission + 1,
      );

      if (this.hasAnyoneWon() != null) {
        this.game.state = "game-over";
        return;
      }

      this.game.phase = "mission-result";
    },
    getTimeLeft() {
      return Math.max(0, this.game.timestampNextPhase - Date.now());
    },
    handleTimeout(): boolean {
      if (this.getTimeLeft() >= 100) {
        return false;
      }

      if (this.isPhase("propose")) {
        this.game.missionPlayers = {};
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.proposingTimeout * 1000;
        this.game.playerProposingMission = this.nextProposerPlayer().id;
        return true;
      }

      if (this.isPhase("proposal-vote")) {
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.proposalVoteResultTimeout * 1000;

        this.game.players
          .filter((p) => !(p.id in this.game.proposalVotes))
          .forEach((p) => {
            this.game.proposalVotes[p.id] = false;
          });
        this.proposalVoteResult();
        return true;
      }

      if (this.isPhase("proposal-vote-result")) {
        if (this.didProposalPass()) {
          this.game.phase = "mission";
          this.game.timestampNextPhase =
            Date.now() + this.game.metaGameData.missionTimeout * 1000;
          this.game.missionPlayers = Object.fromEntries(
            this.game.proposedPlayersIds.map((id) => [
              id,
              {
                playerId: id,
                answered: false,
                hacked: false,
              },
            ]),
          );
        } else {
          this.game.playerProposingMission = this.nextProposerPlayer().id;
          this.game.phase = "propose";
          this.game.proposedPlayersIds = [];
          this.game.timestampNextPhase =
            Date.now() + this.game.metaGameData.proposingTimeout * 1000;
        }

        return true;
      }

      if (this.isPhase("mission")) {
        this.game.missionPlayers = Object.fromEntries(
          Object.entries(this.game.missionPlayers).map(([id, p]) => [
            id,
            { playerId: p.playerId, answered: true, hacked: false },
          ]),
        );
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.missionResultTimeout * 1000;
        this.missionResult();
        return true;
      }

      if (this.isPhase("mission-result")) {
        this.game.playerProposingMission = this.nextProposerPlayer().id;
        this.game.proposedPlayersIds = [];
        this.game.proposalVotes = {};
        this.game.missionPlayers = {};
        this.game.phase = "propose";
        this.game.timestampNextPhase =
          Date.now() + this.game.metaGameData.proposingTimeout * 1000;
        return true;
      }

      return false;
    },
  };
}
