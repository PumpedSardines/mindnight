import React from "react";
import Character from "../Character";
import type { Character as TCharacter } from "@/shared/types";

import styles from "./CharacterPortrait.module.scss";

type CharacterPortraitProps = {
  character: TCharacter;
  text: string;
};

const CharacterPortrait: React.FC<CharacterPortraitProps> = (props) => {
  return (
    <div className={styles["portrait"]}>
      <Character size="large" character={props.character} />
      <p>{props.text}</p>
    </div>
  );
};

export default CharacterPortrait;
