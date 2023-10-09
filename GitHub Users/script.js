import { ButtonAnimation } from "./js/ButtonAnimation.js";
import { GitHubClient } from "./js/GitHubClient.js";

document.querySelector("button").addEventListener("click", button => {
    ButtonAnimation(button);
    setTimeout(button.target.style.opacity = "0", 300);
    setTimeout(() => {
        button.target.remove();
        document.querySelector(".roller").style.display = "block";
    }, 600);
    new GitHubClient();
});