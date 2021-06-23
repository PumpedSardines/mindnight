const socket = io();

socket.emit("project", "project");

const header = document.getElementById("state-header");
const people = document.getElementById("people");
const token = document.getElementById("token-panel");

socket.on("tokens", tokens =>  {

    token.innerHTML = tokens.map(({amount, won}) => {
        if(won == "agent") {
            return `<div class="token agent">${amount}</div>`;
        }

        if(won == "hacker") {
            return `<div class="token hacker">${amount}</div>`;
        }

        return `<div class="token">${amount}</div>`;
    }).join("");

});

socket.on("header", text => {
    header.innerHTML = text;
});

socket.on("players", players => {
    people.innerHTML = players.map(name => {
        return "<h2>" + name + "</h2>";
    }).join("");
});
