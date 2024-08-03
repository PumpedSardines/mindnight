import { JSONSchemaType } from "ajv";
import { Character } from "./types";

const characterSchema: JSONSchemaType<Character> = {
  type: "object",
  properties: {
    body: { type: "string", enum: ["circle", "square", "rhombus", "squircle"] },
    face: {
      type: "string",
      enum: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"],
    },
    color: {
      type: "string",
      enum: ["blue", "green", "pink", "purple", "red", "yellow"],
    },
  },
  required: ["body", "face", "color"],
  additionalProperties: false,
};

export { characterSchema };
