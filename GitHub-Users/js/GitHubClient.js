import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    static #url = "https://api.github.com/users";
    #lastUserId;
    #header;
    #roller;
    #main;

    constructor() {
        this.#lastUserId = 0;
        this.#header = document.querySelector("header");
        this.#roller = this.#header.querySelector(".roller");
        this.#main = document.querySelector("main");
        //tutaj scroll event
        setTimeout(() => this.#Init(), 2400);
    }

    //tutaj
    async #Init() {
        try {
            this.#Success(await this.#GetUsersData(this.#lastUserId));
        }
        catch (error) {
            this.#Fail(error.message);
        }
    }
    //tutaj

    //tutaj
    #Success(users) {
        this.#lastUserId = users[99].id;
        this.#roller.style.display = "none";
        this.#header.classList.add("header-after");
        const searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.addEventListener("keyup", input => this.#FindUser(input.target.value));
        this.#header.insertBefore(searchInput, this.#header.firstChild);
        users.forEach(user => this.#main.appendChild(GitHubClient.UserBox(user)));
    }
    //tutaj

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
                //tutaj
                if (this.status == 200) resolve(this.response);
                else if (this.status == 403) reject(new Error("API rate limit exceeded. Please try again later."));
                else reject(new Error("The application encountered a problem while running. Please try again later."));
                //tutaj
            };

            xmlHttpRequest.onerror = function () {
                reject(new Error("Could not connect to server. Check your connection to the internet."));
            };

            xmlHttpRequest.send();
        });
    }

    //tutaj
    async LoadMore() {
        try {
            const users = await this.#GetUsersData(this.#lastUserId);
        }
        catch (error) {

        }
    }
    //tutaj

    //tutaj
    async #FindUser(find) {
        try {

        }
        catch (error) {

        }
    }
    //tutaj

    //tutaj
    #FindUserRequest(find) {
        fetch(GitHubClient.#url + `/${find}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) return response.json();
            else {
                return response.json().then(errorData => {
                    console.log(errorData); // tutaj
                    throw new Error("The application encountered a problem while running. Please try again later.");
                });
            }
        }).catch(error => {
            console.log(error.message); // tutaj
            throw new Error("Could not connect to server. Check your connection to the internet.");
        });
    }
    //tutaj

    //tutaj
    static UserBox(userData) {
        const userBox = document.createElement('div');
        userBox.classList.add("user-box");
        userBox.innerHTML = `
            <a href="${userData.html_url}" target="_blank">
                <img src="${userData.avatar_url}" alt="Could not load image." />
                <div>
                    <span>Nick:</span> ${userData.login}<br/>
                    <span>Nick:</span> ${fetch(userData.repos_url).then(response => {
            console.log(response.json());
        }).catch(error => "Error")}<br/>
                </div>
            </a>
        `;
        return userBox;
    }
    //tutaj
}