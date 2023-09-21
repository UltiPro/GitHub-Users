import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    static #url = "https://api.github.com/users";
    #header;
    #main;

    constructor() {
        this.#header = document.querySelector("header");
        this.#main = document.querySelector("main");
        setTimeout(() => this.#Init(), 2400);
    }

    async #Init() {
        try {
            const users = await this.#InitData();
            const usersDOM = document.createElement("div");
            users.forEach(user => usersDOM.appendChild(GitHubClient.UserBox(user)));
            this.#Success(usersDOM);
        }
        catch (error) {
            this.#Fail(error.message);
        }
    }

    #InitData() {
        return new Promise(function (resolve, reject) {
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.responseType = "json";
            xmlHttpRequest.getResponseHeader("Content-type", "application/json");
            xmlHttpRequest.open("GET", GitHubClient.#url, true);

            xmlHttpRequest.onload = function () {
                if (this.status >= 200 && this.status < 300) resolve(this.response);
                else reject(new Error("The application encountered a problem while running. Please try again later."));
            };

            xmlHttpRequest.onerror = function () {
                reject(new Error("Could not connect to server. Check your connection to the internet."));
            };

            xmlHttpRequest.send();
        });
    }

    #PrepareDOM() {
        this.#header.childNodes.forEach(node => node.remove());
        this.#main.style.display = "block";
    }

    #Success(usersBox) {
        this.#PrepareDOM();
        this.#header.classList.add("header-after");
        const searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.addEventListener("keyup", input => this.#FindUser(input.target.value));
        this.#header.appendChild(searchInput);
        this.#main.appendChild(usersBox);
    }

    #Fail(info) {
        this.#PrepareDOM();
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

    //tutaj
    #FindUser(find) {
        return fetch(GitHubClient.#url + "/find", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).catch(error => {

        });
    }
    //tutaj

    //tutaj
    static UserBox(userData) {
        const userBox = document.createElement('div');
        userBox.classList.add("user-box");
        userBox.innerHTML = `
            <a href="${userData.html_url}" target="_blank">
                <img src="${userData.avatar_url}" alt="Could not load image." class="user-box-img"/>
                <div class="user-box-body">
                    data jakaś
                </div>
            </a>
        `;
        return userBox;
    }
    //tutaj element.id, element.login
}