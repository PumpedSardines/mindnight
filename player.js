const EventEmitter = require('events');

class Player {
    constructor(socket) {
        this.socket = socket;
        this.event = new EventEmitter();

        this.currentCommand = null;
        this.hacker = false;
        this.name = null;
    }

    async yesOrNo() {
        this.currentCommand = ["yes-or-no", true];
        const data = await new Promise(resolve => {
            this.socket.emit("yes-or-no", true);
            this.event.on("result", val => {
                this.currentCommand = null;
                resolve(val);
            });
         
        });
        this.currentCommand = null;
        return data;
    }

    async select(options, amount = 1) {
        this.currentCommand = ["select", {
            options,
            amount
        }];

        const data = await new Promise(resolve => {
            this.socket.emit("select", {
                options,
                amount
            });

            this.event.on("result", val => {
                this.currentCommand = null;
                resolve(val);
            });
        });
        this.currentCommand = null;
        return data;
    }

    async input() {
        this.currentCommand = ["input", true];
        const data = await new Promise(resolve => {
            this.socket.emit("input", true);

            this.event.on("result", val => {
                resolve(val);
            });

        });
        this.currentCommand = null;
        return data;
    }

    showHtml(html) {
        this.currentCommand = ["showhtml", html];
        this.socket.emit("showhtml", html);
    }

    clear() {
        this.currentCommand = null;
        this.socket.emit("clear");
    }
}

module.exports = Player;