const menu = document.getElementById("menu");

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

window.addEventListener("resize", () => {
  const windowSize = window.innerWidth || document.body.clientWidth;

  if (windowSize > 768) {
    menu.classList.remove("open");
    menu.style.maxHeight = "none";
    menu.style.overflow = "visible";
  } else {
    menu.style.overflow = "hidden";

    if (!menu.classList.contains("open")) {
      menu.style.maxHeight = "0px";
    } else {
      menu.style.maxHeight = menu.scrollHeight + "px";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const windowSize = window.innerWidth || document.body.clientWidth;

  if (windowSize <= 768) {
    menu.classList.remove("open");
    menu.style.maxHeight = "0px";
    menu.style.overflow = "hidden";
  }
});

window.dispatchEvent(new Event('resize'));