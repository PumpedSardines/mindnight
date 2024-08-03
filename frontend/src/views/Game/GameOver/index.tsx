import { Game } from "@/shared/types";
import React from "react";

import styles from "./GameOver.module.scss";
import CharacterPortrait from "@/components/CharacterPortrait";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import MissionState from "@/components/MissionState";
import { getGameHandler } from "@/shared/Game";

type GameOverProps = {
  playerId: string;
  game: Game;
};

const GameOver: React.FC<GameOverProps> = (props) => {
  const navigate = useNavigate();

  const gameHandler = getGameHandler(props.game);
  const didHackersWin = gameHandler.hasAnyoneWon() === "hackers";

  return (
    <main className={styles["root"]}>
      <div>
        <h1>Game Over</h1>
        <h2>
          {(() => {
            if (!didHackersWin) {
              return (
                <>
                  The{" "}
                  <span style={{ color: "var(--color-fulfill)" }}>agents</span>{" "}
                  won the game
                </>
              );
            } else {
              return (
                <>
                  The{" "}
                  <span style={{ color: "var(--color-hack)" }}>hackers</span>{" "}
                  won the game
                </>
              );
            }
          })()}
        </h2>
      </div>
      <div className={styles["winners"]}>
        {props.game.players
          .filter((player) => (didHackersWin ? player.hacker : !player.hacker))
          .map((p) => (
            <CharacterPortrait
              key={p.id}
              character={p.character}
              text={p.name}
            />
          ))}
      </div>
      <MissionState game={props.game} />
      <Button onClick={() => navigate("/")}>Back to main menu</Button>
    </main>
  );
};

export default GameOver;
