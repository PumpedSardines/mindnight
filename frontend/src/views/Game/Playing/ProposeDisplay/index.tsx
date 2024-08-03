import { Game } from "@/shared/types";
import React from "react";

import styles from "./ProposeDisplay.module.scss";
import Button from "@/components/Button";
import { getGameHandler } from "@/shared/Game";
import CharacterPortrait from "@/components/CharacterPortrait";

type ProposeDisplayProps = {
  game: Game;
  localProposedPlayerIds: string[] | null;
  playerId: string;
  onPropose?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
};

const ProposeDisplay: React.FC<ProposeDisplayProps> = (props) => {
  const isProposing =
    props.game.phase === "propose" &&
    props.game.playerProposingMission === props.playerId;
  const hasVoted =
    props.game.phase === "proposal-vote" &&
    props.playerId in props.game.proposalVotes;

  const proposedPlayerIds = isProposing
    ? props.localProposedPlayerIds
    : props.game.proposedPlayersIds;
  const proposingPlayer = props.game.players.find(
    (p) => p.id === props.game.playerProposingMission,
  )!;

  const gameHandler = getGameHandler(props.game);

  return (
    <div className={styles["proposeCont"]}>
      <div className={styles["textCont"]}>
        <h1>
          {(() => {
            if (props.game.phase === "proposal-vote-result") {
              if (gameHandler.didProposalPass()) {
                return "Proposal accepted";
              } else {
                return "Proposal rejected";
              }
            }

            if (props.game.phase === "proposal-vote") {
              if (hasVoted) {
                return "You have voted";
              }
              return "Vote on the proposal";
            }

            if (props.game.phase === "propose" && isProposing) {
              return "You are proposing a team";
            } else {
              return "Waiting for proposal from " + proposingPlayer.name;
            }
          })()}
        </h1>
        <h2>
          Team of {props.game.missions[props.game.mission]!.people} people
        </h2>
      </div>
      <div className={styles["selectedCont"]}>
        {!proposedPlayerIds?.length && (
          <span style={{ fontSize: "2rem" }}>-</span>
        )}
        {proposedPlayerIds?.map((playerId) => {
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
        {isProposing && <Button onClick={props?.onPropose}>Send</Button>}
        {props.game.phase === "proposal-vote" && !hasVoted && (
          <>
            <Button onClick={props?.onReject}>Reject</Button>
            <Button onClick={props?.onAccept}>Accept</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProposeDisplay;
