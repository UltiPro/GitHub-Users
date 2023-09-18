import { ButtonAnimation } from "./ButtonAnimation.js";

export class GitHubClient {
    #header;
    #main;

    constructor() {
        this.#header = document.querySelector("header");
        this.#main = document.querySelector("main");
        setTimeout(() => {
            this.#Init().then(response => this.#PrepareHTMLSuccess(response)).catch(error => this.#PrepareHTMLFail(error));
        }, 1200);
    }

    #SetDefault() {
        this.#header.childNodes.forEach(node => node.remove());
        this.#main.style.display = "block";
    }

    #PrepareHTMLSuccess(data) {
        this.#header.childNodes.forEach(node => node.remove());
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        this.#header.appendChild(input);
        document.querySelector("main").appendChild(data);
    }

    #PrepareHTMLFail(data) {
        this.#SetDefault();
        const errorBox = document.createElement("div");
        errorBox.classList.add("error-box");
        errorBox.innerHTML = `
            <div></div>
            <button>Refresh Page</button>
        `;
        errorBox.childNodes[0].textContent = data;
        errorBox.querySelector("button").addEventListener("click", button => {
            ButtonAnimation(button);
            setTimeout(() => location.reload(), 400);
        });
        this.#main.append(errorBox);
    }

    #Init() {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.getResponseHeader("Content-type", "application/json");
            xhr.open("GET", "https://api.github.com/usersss", true);
            xhr.send();
            xhr.onload = function () {
                if (this.status == 200) {
                    const users = JSON.parse(this.responseText);
                    let htmlCode = document.createElement("main");
                    users.forEach(element => {
                        htmlCode.appendChild(GitHubClient.BuildUserSquare(element.id, element.login, element.avatar_url, element.html_url));
                    });
                    resolve(htmlCode);
                }
                else {
                    const text = JSON.parse(this.responseText);
                    reject("Could not resolve server. Check your connection to the internet.");
                }
            }

            xhr.onerror = function () {
                reject(BuildErrorSquare(this.status));
            }

            xhr.onreadystatechange = function () {
                console.log("State: " + xhr.readyState);
            }
        });
    }

    static BuildErrorSquare(message) {
        const html = document.createElement('div');
        html.classList.add("ErrorBox");
        html.innerText = message;
        return html;
    }

    static BuildUserSquare(id, login, imgUrl, urltoAccount) {
        const html = document.createElement('div');
        html.classList.add("userBox");
        html.innerHTML = `
            <a href="${urltoAccount}">
                <img src="${imgUrl}" title="User Image" class="userBox-img" />
            </a>
            <div class="userBox-body">
                Id: ${id}<br/>
                Login: ${login}<br/>
            </div>
        `;
        return html;
    }
}