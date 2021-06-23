const socket = io();

if (localStorage.getItem("player") === null) {
    socket.emit("player", "player");
} else {
    socket.once("start", () => {
        localStorage.removeItem("player");
        socket.emit("player", "player");
    });
    socket.emit("continue", localStorage.getItem("player"));
}
socket.once("store", id => {
    localStorage.setItem("player", id);
});
socket.once("full", () => {
    form.innerHTML = "LOBBY IS FULL";
});



const form = document.getElementById("phone-form");

const getDataOnce = () => {
    return new Promise(resolve => {
        const listener = e => {
            e.preventDefault();

            form.removeEventListener("submit", listener);

            resolve(new FormData(form));
        }

        form.addEventListener("submit", listener);
    });
}

const returnResult = result => {
    socket.emit("result", result);
    form.innerHTML = "";
}

socket.on("input", async () => {
    form.innerHTML = `
        <input type="text" name="value">
        <button>Välj</button>
    `;

    const data = await getDataOnce();

    returnResult(data.get("value"));
});

socket.on("yes-or-no", async () => {
    form.innerHTML = `
        <select name="value">
            <option value="yes">Ja</option>
            <option value="no">Nej</option>
        </select>
        <button>Välj</button>
    `;

    const data = await getDataOnce();

    returnResult(data.get("value") == "yes");
});

socket.on("select", async ({ options, amount }) => {
    let data = [];
    form.innerHTML = `
        ${options.map(v => {
            return `<div><input type="checkbox" name="${v}">
            <label for="${v}">${v}</label></div>`;
        })}
        <button>Välj</button>
    `;

    while (data.length != amount) {
        const formData = (await getDataOnce());
        data = [...formData.keys()];
        console.log(data);
    }

    returnResult(data);
});

socket.on("showhtml", async (html) => {
    form.innerHTML = html;
});

socket.on("clear", async () => {
    form.innerHTML = "";
});