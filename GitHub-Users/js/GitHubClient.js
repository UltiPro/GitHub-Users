import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    #header;
    #main;

    constructor() {
        this.#header = document.querySelector("header");
        this.#main = document.querySelector("main");
        setTimeout(() => {
            this.#Init().then(response => this.#Success(response)).catch(error => this.#Fail(error));
        }, 2400);
    }

    #Init() {
        return new Promise(function (resolve, reject) {
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.responseType = "json";
            xmlHttpRequest.getResponseHeader("Content-type", "application/json");
            xmlHttpRequest.open("GET", "https://api.github.com/users", true);

            xmlHttpRequest.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    const users = this.response;
                    const usersDOM = document.createElement("div");
                    //tutaj
                    users.forEach(user => usersDOM.appendChild(GitHubClient.UserBox(user)));
                    //tutaj
                    resolve(usersDOM);
                }
                else reject("Could not connect to server. Check your connection to the internet.");
            };

            xmlHttpRequest.onerror = function () {
                reject("The application encountered a problem while running. Please try again later.");
            };

            xmlHttpRequest.send();
        });
    }

    #PrepareDOM() {
        this.#header.childNodes.forEach(node => node.remove());
        this.#main.style.display = "block";
    }

    #Success(users) {
        this.#PrepareDOM();
        this.#header.classList.add("header-after");
        const searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.addEventListener("keyup", input => this.#FindUser(input.target.value));
        this.#header.appendChild(searchInput);
        this.#main.appendChild(users);
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
        console.log(find)
    }

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