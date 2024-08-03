import React, { useMemo } from "react";

import DiceIcon from "@/assets/dice.svg";
import UserSlashIcon from "@/assets/user-slash.svg";

import styles from "./Lobby.module.scss";
import Logo from "@/components/Logo";
import Character from "@/components/Character";
import playSound from "@/soundEffects";
import { Game, Player } from "@/shared/types";
import { randomCharacter } from "@/shared/randomCharacter";
import useUpdateCharacter from "../mutations/updateCharacter";
import Button from "@/components/Button";
import useKickPlayer from "../mutations/kickPlayer";
import { toast } from "react-toastify";
import useStartGame from "../mutations/startGame";

const Lobby: React.FC<{ game: Game; token: string; playerId: string }> = ({
  game,
  playerId,
  token,
}) => {
  const updateCharacter = useUpdateCharacter(game.id, playerId, token);
  const kickPlayer = useKickPlayer(game.id, token);
  const startGame = useStartGame(game.id, token);

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

  const isAdmin =
    players.find((player) => player.id === playerId)?.admin ?? false;

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
      {(() => {
        if (players.length < 2) {
          return <p>Waiting for more players {players.length}/5</p>;
        }

        if (isAdmin) {
          return (
            <Button
              onClick={() => startGame.mutate()}
              loading={startGame.isPending}
            >
              Start Game
            </Button>
          );
        } else {
          return <p>Waiting for lobby admin to start the game...</p>;
        }
      })()}
      <div className={styles["characterGrid"]}>
        {players.map((player) => {
          const currentPlayerIsSelf = player.id === playerId;
          const currentPlayerIsAdmin = player.admin;

          const topText = (() => {
            if (currentPlayerIsSelf && currentPlayerIsAdmin)
              return "You (Admin)";
            if (currentPlayerIsSelf) return "You";
            if (currentPlayerIsAdmin) return "Admin";
            return;
          })();

          return (
            <div key={player.name} className={styles["characterBox"]}>
              {(currentPlayerIsSelf || currentPlayerIsAdmin) && (
                <p className={styles["you"]}>{topText}</p>
              )}
              <Character size="large" character={player.character} />
              <p className={styles["name"]}>{player.name}</p>
              {(currentPlayerIsSelf || isAdmin) && (
                <button
                  className={styles["diceButton"]}
                  onClick={() => {
                    if (currentPlayerIsSelf) {
                      playSound("diceRoll");
                      updateCharacter.mutate(randomCharacter());
                    } else {
                      kickPlayer.mutate(player.id);
                    }
                  }}
                >
                  <img src={currentPlayerIsSelf ? DiceIcon : UserSlashIcon} />
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

export default Lobby;
