const express = require('express');
const app = express();
const http = require('http');
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Player = require("./player.js");
const Project = require("./project.js");

app.get("/project", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/project.html"));
});

app.get("/project.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/project.js"));
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/phone.html"));
})

app.get("/phone.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/phone.js"));
});

let project = null;
let tokens = [1, 2, 1, 2, 2];
let wins = [];
let voterIndex = 0;
const amount = {
    players: 3,
    playersVote: 2,
    hackers: 2
};
const players = {};

async function runGame() {
    project.setTokens(tokens.map((v, i) => {

        if (wins.length > i) {
            return {
                amount: v,
                won: wins[i]
            }
        }

        return {
            amount: v,
            won: null
        }

    }).reverse());
    const playersArray = Object.values(players);

    let votedPeople = [];

    while (true) {
        project.setPlayers([]);
        const voter = playersArray[voterIndex];
        project.setHeader(voter.name + " väljer");
        const people = await voter.select(playersArray.map(v => v.name), tokens[wins.length]);

        project.setHeader("Personer som " + voter.name + " valt");
        project.setPlayers(people);

        const voteResult = await Promise.all(playersArray.map(async player => {
            return {
                res: await player.yesOrNo(),
                name: player.name
            };
        }));

        const correct = voteResult.filter(v => v.res).length >= amount.playersVote;

        voterIndex++;
        if (voterIndex == amount.players) {
            voterIndex = 0;
        }

        project.setHeader(correct ? "Lyckades (röstade ja)" : "Misslyckades (röstade ja)");
        project.setPlayers(voteResult.filter(v => v.res).map(v => v.name));

        await new Promise(resolve => setTimeout(resolve, 10000));

        if (correct) {
            votedPeople = playersArray.filter(v => people.includes(v.name));
            break;
        }
    }

    project.setHeader("Kör noden");
    project.setPlayers(votedPeople.map(v => v.name));

    const voteResult = await Promise.all(votedPeople.map(async player => {
        return await player.yesOrNo();
    }));

    const fails = voteResult.filter(v => !v).length;

    project.setHeader(fails == 0 ? "Nodes lyckades" : fails + " hackade noden");

    await new Promise(resolve => setTimeout(resolve, 10000));



    if (fails == 0) {
        wins.push("agent");
    } else {
        wins.push("hacker");
    }

    runGame();
}


io.on('connection', (socket) => {

    socket.on("project", () => {
        project = new Project(socket);
    })

    socket.on("player", async () => {
        if (Object.keys(players).length == amount.players) {
            socket.emit("full");
            return;
        }

        players[socket.id] = new Player(socket);

        socket.emit("store", socket.id);
        socket.onAny((name, ...args) => {
            players[socket.id].event.emit(name, ...args)
        });

        const name = await players[socket.id].input();

        players[socket.id].name = name;

        if ((!Object.values(players).find(v => v.name == null)) && Object.keys(players).length == amount.players) {
            // Everyone has selected names
            console.log("yes");

            const hackers = [];

            while (hackers.length != amount.hackers) {
                const random = Object.keys(players)[Math.floor(Math.random() * amount.players)];
                if (!hackers.includes(random)) {
                    hackers.push(random);
                }
            }
            hackers.forEach(id => {
                players[id].hacker = true;
            });

            console.log(players);

            Object.values(players).forEach(player => {
                let text = ("<p>Du är " + (player.hacker ? "hacker" : "agent") + "</p>");

                if (player.hacker && amount.hackers > 1) {
                    text += "<p>Andra hackers är: " + Object.values(players).filter(v => v.hacker).map(v => v.name).join(", ") + "</p>";
                }

                player.showHtml(text)

            });

            setTimeout(() => {
                Object.values(players).forEach(player => {
                    player.clear();
                });
                runGame();
            }, 7000);

        }
    });

    socket.on("continue", id => {
        if (id in players) {
            const newPlayer = players[id];
            newPlayer.socket = socket;
            players[socket.id] = newPlayer;
            socket.emit("store", socket.id);

            socket.onAny((name, ...args) => {
                console.log(name);
                newPlayer.event.emit(name, ...args)
            });

            if (newPlayer.currentCommand !== null) {
                socket.emit(...newPlayer.currentCommand);
            }
            players[id].socket.removeAllListeners();
            delete players[id];
        } else {
            socket.emit("start");
        }
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});