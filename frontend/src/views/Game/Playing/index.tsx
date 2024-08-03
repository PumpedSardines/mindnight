import React, { useEffect, useState } from "react";

import styles from "./Playing.module.scss";
import Character from "@/components/Character";
import Logo from "@/components/Logo";
import { Game } from "@/shared/types";
import cx from "@/utils/cx";
import usePropose from "../mutations/propse";
import ProposeDisplay from "./ProposeDisplay";
import useProposeVote from "../mutations/proposeVote";
import { toast } from "react-toastify";
import CountDown from "@/components/CountDown";
import Number from "@/components/Number";
import playSound from "@/soundEffects";
import MissionDisplay from "./MissionDisplay";
import useMission from "../mutations/mission";
import MissionState from "@/components/MissionState";

type PlayingProps = {
  game: Game;
  token: string;
  playerId: string;
};

// This component is all over the place. Not sure how to clean it up though since there are so many different interactions within the same component.

const Playing: React.FC<PlayingProps> = ({ game, playerId, token }) => {
  const propose = usePropose(game.id, token);
  const proposeVote = useProposeVote(game.id, playerId, token);
  const mission = useMission(game.id, playerId, token);

  const self = game.players.find((player) => player.id === playerId)!;

  const step = game.players.findIndex(
    (player) => player.id === game.playerProposingMission,
  );
  const currentMission = game.missions[game.mission]!;

  // PROPOSE LOGIC
  const [localProposedPlayerIds, setLocalProposedPlayerIds] = useState<
    string[] | null
  >(null);
  const isProposing =
    game.phase == "propose" && game.playerProposingMission === playerId;

  useEffect(() => {
    if (game.phase === "proposal-vote") {
      setLocalProposedPlayerIds(null);
    }
  }, [game.phase, playerId, game.playerProposingMission]);

  return (
    <main className={styles["main"]}>
      <aside>
        <div className={styles["logoBox"]}>
          <Logo />
        </div>
        <div
          style={{
            ["--step" as never]: step,
          }}
          className={styles["votingPlayerIndicator"]}
        />
        {game.players.map((player, i) => {
          const isSelf = player.id === playerId;

          const subtitle = (() => {
            if (isSelf || self.hacker)
              return player.hacker ? "Hacker" : "Agent";
            return "???";
          })();

          return (
            <div
              key={i}
              onClick={() => {
                if (!isProposing) return;

                setLocalProposedPlayerIds((prev) => {
                  if (!prev) return [player.id];
                  if (prev.includes(player.id))
                    return prev.filter((id) => id !== player.id);
                  const newSelected = [...prev, player.id];
                  while (newSelected.length > currentMission.people)
                    newSelected.shift();
                  return newSelected;
                });
              }}
              className={cx(
                isProposing && styles["isProposing"],
                styles["playerCont"],
                localProposedPlayerIds?.includes(player.id) &&
                styles["selected"],
                player.hacker && styles["hacker"],
              )}
            >
              <Character size="small" character={player.character} />
              <div>
                <p>
                  {player.name} {isSelf && "(You)"}
                </p>
                <p className={styles["subtitle"]}>{subtitle}</p>
                {(() => {
                  if (game.phase === "proposal-vote") {
                    if (player.id in game.proposalVotes) {
                      return <p className={styles["extraText"]}>VOTED</p>;
                    }
                  }

                  if (game.phase === "proposal-vote-result") {
                    if (game.proposalVotes[player.id]) {
                      return <p className={styles["extraText"]}>ACCEPT</p>;
                    } else {
                      return <p className={styles["extraText"]}>REJECT</p>;
                    }
                  }

                  return null;
                })()}
              </div>
            </div>
          );
        })}
      </aside>
      <section>
        <p className={styles["countDownTimer"]}>
          Time left:{" "}
          <Number>
            <CountDown
              timestamp={game.timestampNextPhase}
              onTick={(time) => {
                if (
                  game.phase === "mission-result" ||
                  game.phase === "proposal-vote-result"
                ) {
                  return;
                }

                if (time < 10) {
                  playSound("diceRoll");
                }
              }}
            />
          </Number>
        </p>
        {(() => {
          if (
            game.phase === "propose" ||
            game.phase === "proposal-vote" ||
            game.phase === "proposal-vote-result"
          ) {
            return (
              <ProposeDisplay
                game={game}
                localProposedPlayerIds={localProposedPlayerIds}
                playerId={playerId}
                onPropose={() => {
                  if (
                    (localProposedPlayerIds?.length ?? 0) !==
                    currentMission.people
                  ) {
                    toast.error(
                      `You must select ${currentMission.people} players to go on the mission.`,
                    );
                  } else {
                    propose.mutate(localProposedPlayerIds!);
                  }
                }}
                onAccept={() => {
                  setLocalProposedPlayerIds(null);
                  proposeVote.mutate(true);
                }}
                onReject={() => {
                  proposeVote.mutate(false);
                  setLocalProposedPlayerIds(null);
                }}
              />
            );
          } else {
            return (
              <MissionDisplay
                game={game}
                playerId={playerId}
                onHack={() => {
                  mission.mutate(true);
                }}
                onFulfill={() => {
                  mission.mutate(false);
                }}
              />
            );
          }
        })()}
        <MissionState game={game} />
      </section>
    </main>
  );
};

export default Playing;
