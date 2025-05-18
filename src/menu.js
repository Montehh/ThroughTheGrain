const menu = document.getElementById("menu");

// Toggle burger menu
function menuToggle() {
  const isOpen = menu.classList.contains("open");

  if (isOpen) {
    menu.classList.remove("open");
    menu.style.maxHeight = "0px";
  } else {
    menu.classList.add("open");
    menu.style.maxHeight = menu.scrollHeight + "px";
  }
}

// Resize listener to reset menu on desktop
window.addEventListener("resize", () => {
  const windowSize = window.innerWidth || document.body.clientWidth;

  if (windowSize > 640) {
    menu.classList.remove("open");
    menu.style.maxHeight = "none"; // remove limit so it shows fully
    menu.style.overflow = "visible";
  } else {
    menu.style.overflow = "hidden";

    if (!menu.classList.contains("open")) {
      menu.style.maxHeight = "0px"; // collapsed
    } else {
      menu.style.maxHeight = menu.scrollHeight + "px"; // expanded
    }
  }
});

// Initialize on load (in case user resizes before any interaction)
window.dispatchEvent(new Event('resize'));