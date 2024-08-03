import DiceSound from "@/assets/sounds/dice.mp3";
import YourTurn from "@/assets/sounds/your-turn.mp3";

import MissionSuccess from "@/assets/sounds/mission-success.mp3";
import MissionFailure from "@/assets/sounds/mission-failure.mp3";

const soundEffects = {
  diceRoll: new Audio(DiceSound),
  yourTurn: new Audio(YourTurn),
  missionSuccess: new Audio(MissionSuccess),
  missionFailure: new Audio(MissionFailure),
};

const playSound = (sound: keyof typeof soundEffects) => {
  const audio = soundEffects[sound];

  if (!audio.paused || audio.currentTime) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio.play();
};

export default playSound;
