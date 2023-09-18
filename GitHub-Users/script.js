import { GitHubClient } from "./js/GitHubClient.js";

document.querySelector("button").addEventListener("click", element => {
    const insideBtnTop = element.clientY - element.target.offsetTop;
    const insideBtnLeft = element.clientX - element.target.offsetLeft;
    const circle = document.createElement("span");
    circle.classList.add("circle");
    circle.style.top = insideBtnTop + "px";
    circle.style.left = insideBtnLeft + "px";
    element.target.appendChild(circle);
    setTimeout(element.target.style.opacity = "0", 300);
    setTimeout(() => {
        element.target.remove();
        document.querySelector(".roller").style.display = "block";
    }, 600);
    new GitHubClient();
});