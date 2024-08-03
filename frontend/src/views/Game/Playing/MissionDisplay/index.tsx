import { Game } from "@/shared/types";
import React from "react";

import styles from "./MissionDisplay.module.scss";
import Button from "@/components/Button";
import CharacterPortrait from "@/components/CharacterPortrait";

type MissionDisplayProps = {
  game: Game;
  playerId: string;
  onFulfill?: () => void;
  onHack?: () => void;
};

const MissionDisplay: React.FC<MissionDisplayProps> = (props) => {
  const isInMission = props.playerId in props.game.missionPlayers;
  const hasVoted =
    isInMission && props.game.missionPlayers[props.playerId]!.answered;
  const didHack =
    isInMission &&
    hasVoted &&
    props.game.missionPlayers[props.playerId]!.hacked;

  const showingMissionResult = props.game.phase === "mission-result";
  const missionResult =
    showingMissionResult &&
    props.game.missions[props.game.mission - 1]?.hackedVotes;

  return (
    <div className={styles["proposeCont"]}>
      <div className={styles["textCont"]}>
        <h1>
          {(() => {
            if (showingMissionResult) {
              if (missionResult === 0) {
                return (
                  <>
                    Mission was{" "}
                    <span style={{ color: "var(--color-fulfill)" }}>
                      fulfilled
                    </span>{" "}
                  </>
                );
              } else {
                const text = missionResult === 1 ? "player" : "players";
                return (
                  <>
                    Mission was{" "}
                    <span style={{ color: "var(--color-hack)" }}>hacked</span>{" "}
                    by {missionResult} {text}
                  </>
                );
              }
            }

            if (!isInMission) {
              return "Waiting for players to do the mission";
            }

            if (props.game.phase === "mission") {
              if (hasVoted) {
                return didHack ? (
                  <>
                    You{" "}
                    <span style={{ color: "var(--color-hack)" }}>hacked</span>{" "}
                    the mission
                  </>
                ) : (
                  <>
                    You{" "}
                    <span style={{ color: "var(--color-fulfill)" }}>
                      fulfilled
                    </span>{" "}
                    the mission
                  </>
                );
              }

              return (
                <>
                  <span style={{ color: "var(--color-fulfill)" }}>Fulfill</span>{" "}
                  or <span style={{ color: "var(--color-hack)" }}>hack</span>{" "}
                  the mission
                </>
              );
            }

            return null;
          })()}
        </h1>
      </div>
      <div className={styles["selectedCont"]}>
        {Object.values(props.game.missionPlayers).map(({ playerId }) => {
          const player = props.game.players.find((p) => p.id === playerId)!;

          return (
            <CharacterPortrait
              key={player.id}
              character={player.character}
              text={player.name}
            />
          );
        })}
      </div>
      <div className={styles["proposeButtons"]}>
        {isInMission && !hasVoted && (
          <>
            <Button variant="hack" onClick={props?.onHack}>
              Hack
            </Button>
            <Button onClick={props?.onFulfill}>Fulfill</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MissionDisplay;
