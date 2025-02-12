import { getQuestions } from "../api.js";
import { getQueryParams } from "../utilities.js";
import { home } from "../pages/home.js";
import { mainModal } from "../../index.js";

const app = document.querySelector(".app");

const quiz = async () => {
  app.innerHTML = "";
  let step = 0;
  window.questions = null;

  const handleQuizAnswer = (e) => {
    const answer = e.target.innerHTML;
    if (questions[step].user_answer) {
      if (questions[step]?.user_answer?.includes(answer)) {
        const newArray = questions[step].user_answer.filter(
          (uAnswer) => uAnswer !== answer
        );
        questions[step].user_answer = newArray;
      } else questions[step].user_answer.push(answer);
    } else questions[step].user_answer = [answer];
    e.target.className = questions[step]?.user_answer?.includes(answer)
      ? "button selected"
      : "button unselected";
  };

  const renderQuizStep = (questionObj, container) => {
    const question = document.createElement("h3");
    question.innerHTML = `${step + 1}. ${questionObj.question}`;
    const answers = [
      questionObj.correct_answer,
      ...questionObj.incorrect_answers,
    ].shuffle();
    console.log(answers);
    const fragment = document.createDocumentFragment();
    answers.forEach((answer) => {
      const answerBtn = document.createElement("button");
      answerBtn.className = questionObj?.user_answer?.includes(answer)
        ? "button selected"
        : "button unselected";
      answerBtn.innerHTML = answer;
      answerBtn.addEventListener("click", handleQuizAnswer);
      fragment.append(answerBtn);
    });
    container.append(question, fragment);
  };

  const getCorrectAnswers = () => {
    const correctAnswers = [];
    questions.forEach((questionObj) => {
      if (
        questionObj?.user_answer &&
        questionObj.user_answer[0] === questionObj.correct_answer
      )
        correctAnswers.push(questionObj);
    });
    return correctAnswers;
  };

  const buildQuizStepNavigation = () => {
    const container = document.createElement("div");
    container.className = "btn-container";
    const prevBtn = document.createElement("button");
    prevBtn.className = "button btn-app";
    prevBtn.innerText = "Previous";
    const nextBtn = document.createElement("button");
    nextBtn.className = "button btn-app";
    nextBtn.innerText = "Next";

    container.append(prevBtn, nextBtn);

    prevBtn.addEventListener("click", () => {
      if (step > 0) {
        step--;
        const questionContainer = document.querySelector(
          ".quiz_question-container"
        );
        questionContainer.innerHTML = "";
        renderQuizStep(questions[step], questionContainer);
        const info = document.querySelector(".info-container");
        renderStepInfo(info);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (step === questions.length - 1) {
        const showModalEvent = new Event("show-modal-event");
        window.modal = {
          title: "Do you want to submit your quiz?",
          body: `<p> You answered to ${
            window.questions.filter((question) => question?.user_answer).length
          } questions.</p>`,
          onSubmit: function () {
            window.modal.title = "Your answers";
            window.modal.body = `<p> Correct Answers = ${
              getCorrectAnswers().length
            }</p>`;
            const subBtn = document.getElementById("modalSubmitButton");
            subBtn.innerText = "Restart";

            subBtn.onclick = window.modal.onRestart;

            window.dispatchEvent(showModalEvent);
          },

          onRestart: function () {
            home();

            mainModal.hide();
          },
        };
        window.dispatchEvent(showModalEvent);
        return;
      }
      step++;
      const questionContainer = document.querySelector(
        ".quiz_question-container"
      );
      questionContainer.innerHTML = "";
      renderQuizStep(questions[step], questionContainer);
      const info = document.querySelector(".info-container");
      renderStepInfo(info);
    });
    return container;
  };

  const renderStepInfo = (container) => {
    container.innerHTML = `
    <p>Category: <span>${questions[step].category}</span></p>
    <p>Difficulty: <span>${
      questions[step].difficulty.charAt(0).toUpperCase() +
      questions[step].difficulty.slice(1)
    }</span></p>
    `;
    return container;
  };

  try {
    const params = getQueryParams(window.location.search);
    console.log(params);
    const res = await getQuestions(params);
    questions = res.results;
    console.log(questions);
    const container = document.createElement("div");
    container.className = "quiz_question-container";
    renderQuizStep(questions[step], container);
    const quizStepNavigation = buildQuizStepNavigation();
    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";
    renderStepInfo(infoContainer);

    app.append(container, infoContainer, quizStepNavigation);
  } catch (error) {
    console.log(error);
  }
};

export default quiz;
