import React from "react";

import BlueBodyCircle from "@/assets/character/blue_body_circle.png";
import BlueBodyRhombus from "@/assets/character/blue_body_rhombus.png";
import BlueBodySquare from "@/assets/character/blue_body_square.png";
import BlueBodySquircle from "@/assets/character/blue_body_squircle.png";

import GreenBodyCircle from "@/assets/character/green_body_circle.png";
import GreenBodyRhombus from "@/assets/character/green_body_rhombus.png";
import GreenBodySquare from "@/assets/character/green_body_square.png";
import GreenBodySquircle from "@/assets/character/green_body_squircle.png";

import PinkBodyCircle from "@/assets/character/pink_body_circle.png";
import PinkBodyRhombus from "@/assets/character/pink_body_rhombus.png";
import PinkBodySquare from "@/assets/character/pink_body_square.png";
import PinkBodySquircle from "@/assets/character/pink_body_squircle.png";

import PurpleBodyCircle from "@/assets/character/purple_body_circle.png";
import PurpleBodyRhombus from "@/assets/character/purple_body_rhombus.png";
import PurpleBodySquare from "@/assets/character/purple_body_square.png";
import PurpleBodySquircle from "@/assets/character/purple_body_squircle.png";

import RedBodyCircle from "@/assets/character/red_body_circle.png";
import RedBodyRhombus from "@/assets/character/red_body_rhombus.png";
import RedBodySquare from "@/assets/character/red_body_square.png";
import RedBodySquircle from "@/assets/character/red_body_squircle.png";

import YellowBodyCircle from "@/assets/character/yellow_body_circle.png";
import YellowBodyRhombus from "@/assets/character/yellow_body_rhombus.png";
import YellowBodySquare from "@/assets/character/yellow_body_square.png";
import YellowBodySquircle from "@/assets/character/yellow_body_squircle.png";

import FaceA from "@/assets/character/face_a.png";
import FaceB from "@/assets/character/face_b.png";
import FaceC from "@/assets/character/face_c.png";
import FaceD from "@/assets/character/face_d.png";
import FaceE from "@/assets/character/face_e.png";
import FaceF from "@/assets/character/face_f.png";
import FaceG from "@/assets/character/face_g.png";
import FaceH from "@/assets/character/face_h.png";
import FaceI from "@/assets/character/face_i.png";
import FaceJ from "@/assets/character/face_j.png";
import FaceK from "@/assets/character/face_k.png";
import FaceL from "@/assets/character/face_l.png";

import type { Character, CharacterBody, CharacterColor } from "@/shared/types";
import styles from "./Character.module.scss";
import cx from "@/utils/cx";

const bodies = {
  blue: {
    circle: BlueBodyCircle,
    rhombus: BlueBodyRhombus,
    square: BlueBodySquare,
    squircle: BlueBodySquircle,
  },
  green: {
    circle: GreenBodyCircle,
    rhombus: GreenBodyRhombus,
    square: GreenBodySquare,
    squircle: GreenBodySquircle,
  },
  pink: {
    circle: PinkBodyCircle,
    rhombus: PinkBodyRhombus,
    square: PinkBodySquare,
    squircle: PinkBodySquircle,
  },
  purple: {
    circle: PurpleBodyCircle,
    rhombus: PurpleBodyRhombus,
    square: PurpleBodySquare,
    squircle: PurpleBodySquircle,
  },
  red: {
    circle: RedBodyCircle,
    rhombus: RedBodyRhombus,
    square: RedBodySquare,
    squircle: RedBodySquircle,
  },
  yellow: {
    circle: YellowBodyCircle,
    rhombus: YellowBodyRhombus,
    square: YellowBodySquare,
    squircle: YellowBodySquircle,
  },
};

const faces = {
  a: FaceA,
  b: FaceB,
  c: FaceC,
  d: FaceD,
  e: FaceE,
  f: FaceF,
  g: FaceG,
  h: FaceH,
  i: FaceI,
  j: FaceJ,
  k: FaceK,
  l: FaceL,
};

(async () => {
  for (const color of Object.keys(bodies) as CharacterColor[]) {
    for (const body of Object.keys(bodies[color]) as CharacterBody[]) {
      new Promise((resolve) => {
        const img = new Image();
        img.src = bodies[color][body];
        img.onload = resolve;
      });
    }
  }

  for (const face of Object.values(faces) as string[]) {
    new Promise((resolve) => {
      const img = new Image();
      img.src = face;
      img.onload = resolve;
    });
  }
})();

type CharacterProps = {
  character: Character;
  size?: "small" | "medium" | "large";
};

const Character: React.FC<CharacterProps> = (props) => {
  const { color, body, face } = props.character;
  const variant = props.size ?? "medium";

  return (
    <div className={cx(styles["character"], styles[variant])}>
      <img
        draggable={false}
        className={styles["body"]}
        src={bodies[color][body]}
      />
      <img draggable={false} className={styles["face"]} src={faces[face]} />
    </div>
  );
};

export default Character;
