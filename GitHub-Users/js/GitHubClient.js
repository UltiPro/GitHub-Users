import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    #header;
    #main;

    constructor() {
        this.#header = document.querySelector("header");
        this.#main = document.querySelector("main");
        //tutaj
        setTimeout(() => {
            this.#Init().then(response => this.#Success(response)).catch(error => this.#Fail(error));
        }, 2400);
        //tutaj
    }

    //tutaj
    #Init() {
        return new Promise(function (resolve, reject) { //xhr response type json
            const xhr = new XMLHttpRequest();
            xhr.getResponseHeader("Content-type", "application/json");
            xhr.open("GET", "https://api.github.com/users", true);
            xhr.send();
            xhr.onload = function () {
                if (this.status == 200) {
                    const users = JSON.parse(this.responseText);
                    let htmlCode = document.createElement("main");
                    users.forEach(element => {
                        htmlCode.appendChild(GitHubClient.UserBox(element));
                    });
                    resolve(htmlCode);
                }
                else {
                    const text = JSON.parse(this.responseText);
                    reject("Could not connect to server. Check your connection to the internet.");
                }
            }

            xhr.onerror = function () {
                reject("Could not connect to server. Check your connection to the internet.");
            }

            xhr.onreadystatechange = function () {
                console.log("State: " + xhr.readyState);
            }
        });
    }
    //tutaj

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