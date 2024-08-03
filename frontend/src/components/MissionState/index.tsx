import React from "react";

import styles from "./MissionState.module.scss";
import { Game } from "@/shared/types";
import Number from "@/components/Number";
import cx from "@/utils/cx";

type MissionStateProps = {
  game: Game;
};

const MissionState: React.FC<MissionStateProps> = (props) => {
  const { missions, mission: missionIndex } = props.game;
  const isGameOver = props.game.state === "game-over";

  return (
    <div className={styles["missions"]}>
      {missions.map((mission, index) => {
        const hackedVotes = mission.hackedVotes || 0;
        const isDone = mission.done;
        const isNext = index === missionIndex;

        if (isNext && !isGameOver) {
          return (
            <MissionBubble key={index} people={mission.people}>
              <div className={styles["next"]} />
            </MissionBubble>
          );
        }

        if (!isDone) {
          return <MissionBubble key={index} people={mission.people} />;
        }

        return (
          <MissionBubble key={index} people={mission.people}>
            {mission != null && (
              <div
                className={cx(
                  styles["brick"],
                  hackedVotes === 0 && styles["fulfill"],
                  hackedVotes !== 0 && styles["hack"],
                )}
              >
                <p>
                  <Number>{hackedVotes}</Number>
                </p>
              </div>
            )}
          </MissionBubble>
        );
      })}
    </div>
  );
};

type MissionBubbleProps = {
  people: number;
  children?: React.ReactNode;
};

function MissionBubble(props: MissionBubbleProps) {
  return (
    <div className={styles["mission"]}>
      {props.children}
      <p className={styles["peopleInMission"]}>
        <Number>{props.people}</Number>
      </p>
    </div>
  );
}

export default MissionState;
