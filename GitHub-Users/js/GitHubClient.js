import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    static #url = "https://api.github.com/users";
    #lastUserId;
    #header;
    #main;
    #footer;
    #roller;

    constructor() {
        this.#lastUserId = 0;
        this.#header = document.querySelector("header");
        this.#main = document.querySelector("main");
        this.#footer = document.querySelector("footer");
        this.#roller = this.#header.querySelector(".roller");
        setTimeout(() => this.#Init(), 2400);
    }

    async #Init() {
        try {
            this.#Success(await this.#GetUsersData(this.#lastUserId));
            addEventListener("scrollend", () => {
                if (window.innerHeight + Math.round(window.scrollY) + 120 >= document.body.offsetHeight) this.#LoadMore();
            });
        }
        catch (error) {
            this.#Fail(error.message);
        }
    }

    #Success(users) {
        this.#lastUserId = users[99].id;
        this.#roller.style.display = "none";
        this.#footer.appendChild(this.#roller);
        this.#header.classList.add("header-after");
        const searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.addEventListener("keyup", input => this.#FindUser(input.target.value));
        this.#header.insertBefore(searchInput, this.#header.firstChild);
        users.forEach(user => this.#main.appendChild(GitHubClient.#UserBox(user)));
        this.#roller.style.display = "block";
    }

    #Fail(info) {
        this.#roller.style.display = "none";
        const errorBox = document.createElement("div");
        errorBox.classList.add("error-box");
        errorBox.innerHTML = `
            <div>${info}</div>
            <button>Refresh Page</button>
        `;
        errorBox.querySelector("button").addEventListener("click", button => {
            ButtonAnimation(button);
            setTimeout(() => location.reload(), 300);
        });
        this.#main.append(errorBox);
    }

    #GetUsersData(lastUserId) {
        return new Promise(function (resolve, reject) {
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.responseType = "json";
            xmlHttpRequest.getResponseHeader("Content-type", "application/json");
            xmlHttpRequest.open("GET", GitHubClient.#url + `?per_page=100&since=${lastUserId}`, true);

            xmlHttpRequest.onload = function () {
                if (this.status == 200) resolve(this.response);
                else if (this.status == 403) reject(new Error("API rate limit exceeded. Please try again later."));
                else reject(new Error("The application encountered a problem while running. Please try again later."));
            };

            xmlHttpRequest.onerror = function () {
                reject(new Error("Could not connect to server. Check your connection to the internet."));
            };

            xmlHttpRequest.send();
        });
    }

    async #LoadMore() {
        if (this.#roller.parentElement != this.#footer) {
            this.#footer.appendChild(this.#roller);
            this.#roller.style.display = "block";
        }
        try {
            const users = await this.#GetUsersData(this.#lastUserId);
            this.#lastUserId = users[99].id;
            users.forEach(user => this.#main.appendChild(GitHubClient.#UserBox(user)));
        }
        catch (error) {
            this.#roller.style.display = "none";
            console.log(error.message);
        }
    }

    //tutaj
    async #FindUser(find) {
        try {
            this.#main.remove();
            this.#main = document.createElement("main");
            document.body.insertBefore(this.#main, this.#footer);
            if (this.#roller.parentElement != this.#header) {
                this.#header.appendChild(this.#roller);
            }
            this.#roller.style.display = "block";
            if (find == "") {
                this.#lastUserId = 0;
                const users = await this.#GetUsersData(this.#lastUserId);
                this.#lastUserId = users[99].id;
                users.forEach(user => this.#main.appendChild(GitHubClient.#UserBox(user)));
            } else {
                const user = this.#FindUserRequest(find);
                this.#main.appendChild(GitHubClient.#UserBox(user));
            }
            this.#roller.style.display = "none";
        }
        catch (error) {
            console.log(error.message)
        }
    }

    async #FindUserRequest(find) {
        return await fetch(GitHubClient.#url + `/${find}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => {
            if (response.status == 200) return response.json();
            else if (response.status == 403) throw new Error("API rate limit exceeded. Please try again later.");
            else if (response.status == 404) throw new Error("404 User Not Found."); // tutaj
            else throw new Error("The application encountered a problem while running. Please try again later.");
        }).catch(_ => {
            throw new Error("Could not connect to server. Check your connection to the internet.");
        });
    }
    //tutaj

    static #UserBox(userData) {
        const userBox = document.createElement("div");
        userBox.classList.add("user-box");
        userBox.innerHTML = `
            <a href="${userData.html_url}" target="_blank">
                <img src="${userData.avatar_url}" alt="Could not load image." />
                <div>
                    <span>Nick:</span> ${userData.login}<br/>
                    <span>ID:</span> ${userData.id}<br/>
                </div>
            </a>
        `;
        return userBox;
    }
}