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
import { getGameHandler } from "@/shared/Game";

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

  const gameHandler = getGameHandler(game);

  const self = gameHandler.getPlayer(playerId);
  if (!self) throw new Error("Player not found");

  const proposingPlayer = gameHandler.getProposingPlayer();
  const step = gameHandler.getProposingPlayerIndex();
  const currentMission = gameHandler.getCurrentMission();

  // PROPOSE LOGIC
  const [localProposedPlayerIds, setLocalProposedPlayerIds] = useState<
    string[] | null
  >(null);
  const isProposing =
    gameHandler.isPhase("propose") && proposingPlayer.id === self.id;

  useEffect(() => {
    if (game.phase === "proposal-vote") {
      setLocalProposedPlayerIds(null);
    }
  }, [game.phase, game.playerProposingMission]);

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
        {gameHandler.getPlayers().map((player) => {
          const isSelf = player.id === self.id;

          const subtitle = (() => {
            if (isSelf || self.hacker)
              return player.hacker ? "Hacker" : "Agent";
            return "???";
          })();

          const extraText = (() => {
            if (game.phase === "proposal-vote") {
              if (player.id in game.proposalVotes) {
                return "VOTED";
              }
            }

            if (game.phase === "proposal-vote-result") {
              if (game.proposalVotes[player.id]) {
                return "ACCEPT";
              } else {
                return "REJECT";
              }
            }

            return null;
          })();

          return (
            <div
              key={player.id}
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
                  {player.name}
                  {isSelf && " (You)"}
                </p>
                <p className={styles["subtitle"]}>{subtitle}</p>
                {extraText && (
                  <p className={styles["extraText"]}>{extraText}</p>
                )}
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
