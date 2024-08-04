import React, { useMemo } from "react";

import DiceIcon from "@/assets/dice.svg";
import UserSlashIcon from "@/assets/user-slash.svg";

import styles from "./Lobby.module.scss";
import Logo from "@/components/Logo";
import Character from "@/components/Character";
import playSound from "@/soundEffects";
import { Game, GameHandler, Player } from "@/shared/types";
import { randomCharacter } from "@/shared/randomCharacter";
import useUpdateCharacter from "../mutations/updateCharacter";
import Button from "@/components/Button";
import useKickPlayer from "../mutations/kickPlayer";
import { toast } from "react-toastify";
import useStartGame from "../mutations/startGame";
import { getGameHandler } from "@/shared/Game";

const Lobby: React.FC<{ game: Game; token: string; playerId: string }> = ({
  game,
  playerId,
  token,
}) => {
  const updateCharacter = useUpdateCharacter(game.id, playerId, token);
  const kickPlayer = useKickPlayer(game.id, token);
  const startGame = useStartGame(game.id, token);
  const gameHandler = getGameHandler(game);

  const players = useMemo(() => {
    const players = JSON.parse(JSON.stringify(game.players)) as Player[];

    players.sort((a, b) => {
      if (a.admin) return -1;
      if (b.admin) return 1;
      if (a.id === playerId) return -1;
      if (b.id === playerId) return 1;
      return 0;
    });

    return players;
  }, [game.players, playerId]);

  const self = gameHandler.getPlayer(playerId);
  if (!self) throw new Error("Player not found");

  return (
    <div className={styles["root"]}>
      <div className={styles["logoBox"]}>
        <Logo />
        <button
          className={styles["copyCodeButton"]}
          onClick={() => {
            navigator.clipboard.writeText(`${game.id}`);
            toast.info("Invite link copied to clipboard");
          }}
        >
          <p>Game Code: {game.id}</p>
        </button>
      </div>
      <LobbyInfoText
        gameHandler={gameHandler}
        admin={self.admin}
        onStartGame={startGame.mutate}
        isLoadingStartGame={startGame.isPending}
      />
      <div className={styles["characterGrid"]}>
        {players.map((player) => {
          const playerIsSelf = player.id === playerId;
          const playerIsAdmin = self.admin;

          const topText = (() => {
            if (playerIsSelf && playerIsAdmin) return "You (Admin)";
            if (playerIsSelf) return "You";
            if (playerIsAdmin) return "Admin";
            return;
          })();

          return (
            <div key={player.id} className={styles["characterBox"]}>
              {(playerIsSelf || playerIsAdmin) && (
                <p className={styles["you"]}>{topText}</p>
              )}
              <Character size="large" character={player.character} />
              <p className={styles["name"]}>{player.name}</p>
              {(playerIsSelf || playerIsAdmin) && (
                <button
                  className={styles["diceButton"]}
                  onClick={() => {
                    if (playerIsSelf) {
                      playSound("diceRoll");
                      updateCharacter.mutate(randomCharacter());
                    } else {
                      kickPlayer.mutate(player.id);
                    }
                  }}
                >
                  <img src={playerIsSelf ? DiceIcon : UserSlashIcon} />
                </button>
              )}
            </div>
          );
        })}
        {new Array(4 - (players.length % 4)).fill(null).map((_, i) => (
          <div key={i} className={styles["characterBoxNon"]} />
        ))}
      </div>
    </div>
  );
};

type LobbyInfoTextProps = {
  gameHandler: GameHandler;
  onStartGame: () => void;
  isLoadingStartGame: boolean;
  admin: boolean;
};

function LobbyInfoText(props: LobbyInfoTextProps) {
  const { gameHandler, admin, onStartGame, isLoadingStartGame } = props;

  const amountOfPlayers = gameHandler.game.players.length;
  const minPlayers = gameHandler.game.metaGameData.minPlayers;
  const maxPlayers = gameHandler.game.metaGameData.maxPlayers;

  if (!gameHandler.canStartGame()) {
    if (gameHandler.isPlayerCountTooLow()) {
      return (
        <p>
          Waiting for more players {amountOfPlayers}/{minPlayers}
        </p>
      );
    }

    if (gameHandler.isPlayerCountTooHigh()) {
      return (
        <p>
          Too many players {amountOfPlayers}/{maxPlayers}
        </p>
      );
    }

    return <p>Unknown error, please refresh the page or contact support</p>;
  }

  if (admin) {
    return (
      <Button onClick={onStartGame} loading={isLoadingStartGame}>
        Start Game
      </Button>
    );
  } else {
    return <p>Waiting for lobby admin to start the game...</p>;
  }
}

export default Lobby;
