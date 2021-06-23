class Project {
    constructor(socket) {
        this.socket = socket;
    }

    setTokens(tokens) {
        this.socket.emit("tokens", tokens);
    } 

    setHeader(header) {
        this.socket.emit("header", header);
    }

    setPlayers(players) {
        this.socket.emit("players", players);
    } 
}

module.exports = Project;