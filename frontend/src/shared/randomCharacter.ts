import type { Character } from "@/shared/types";

export function randomCharacter(): Character {
  const colors = ["blue", "green", "pink", "purple", "red", "yellow"];
  const bodies = ["circle", "rhombus", "square", "squircle"];
  const faces = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];

  const color = colors[Math.floor(Math.random() * colors.length)];
  const body = bodies[Math.floor(Math.random() * bodies.length)];
  const face = faces[Math.floor(Math.random() * faces.length)];

  return { color, body, face } as Character;
}
