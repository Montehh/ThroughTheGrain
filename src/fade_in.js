document.addEventListener("DOMContentLoaded", () => {
  runFadeIn();
});

function runFadeIn() {
  const elements = document.querySelectorAll(".fade-target:not(.fade-in)");
  let delay = 0;
  elements.forEach((el) => {
    setTimeout(() => {
      el.classList.add("fade-in");
    }, delay);
    delay += 100;
  });
}

window.runFadeIn = runFadeIn;