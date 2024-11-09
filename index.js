import home from "./script/pages/home.js";
import quiz from "./script/pages/quiz.js";
import { fisherYatesShuffle } from "./script/utilities.js";

// Adding shuffle method to array prototype
Array.prototype.shuffle = function () {
  return fisherYatesShuffle(this);
};

export const mainModal = new bootstrap.Modal(
  document.getElementById("mainModal"),
  {}
);

window.addEventListener("load", async () => {
  window.addEventListener("popstate", (event) => {
    const location = window.location.pathname;
    switch (location) {
      case "/":
        home();
        break;
      case "/quiz":
        quiz();
        break;
      default:
        home();
        break;
    }
  });

  window.addEventListener("show-modal-event", () => {
    console.log(("show-modal-event", window.modal));
    const modal = document.getElementById("mainModal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    const modalSubmitBtn = modal.querySelector("#modalSubmitButton");
    modalSubmitBtn.addEventListener("click", window.modal.onSubmit);
    modalBody.innerHTML = window.modal.body;
    modalTitle.innerText = window.modal.title;

    mainModal.show();
  });

  home();
});
