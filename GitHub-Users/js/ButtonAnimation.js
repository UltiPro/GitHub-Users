export function ButtonAnimation(button) {
    const insideBtnTop = button.clientY - button.target.offsetTop;
    const insideBtnLeft = button.clientX - button.target.offsetLeft;
    const circle = document.createElement("span");
    circle.classList.add("circle");
    circle.style.top = insideBtnTop + "px";
    circle.style.left = insideBtnLeft + "px";
    button.target.appendChild(circle);
}