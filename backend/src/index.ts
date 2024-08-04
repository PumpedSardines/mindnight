import * as express from "express";
import * as cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

import initSocket from "@/socket";

import createGameRoute from "@/routes/createGame";
import joinGameRoute from "@/routes/joinGame";
import getGameRoute from "@/routes/getGame";
import canJoinGameRoute from "@/routes/canJoinGame";
import updateCharacter from "./routes/updateCharacter";
import kickPlayer from "./routes/kickPlayer";
import startGame from "./routes/startGame";
import propose from "./routes/playing/propose";
import proposeVote from "./routes/playing/proposal-vote";
import mission from "./routes/playing/mission";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(cors((_, callback) => callback(null, { origin: true })));

app.get("/", (_, res) => {
  res.send("Healthy");
});

initSocket(io);

createGameRoute(app);
getGameRoute(app);
canJoinGameRoute(app);
joinGameRoute(app, io);
updateCharacter(app, io);
kickPlayer(app, io);
startGame(app, io);

propose(app, io);
proposeVote(app, io);
mission(app, io);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
