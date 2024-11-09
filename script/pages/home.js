import { formShape } from "../data.js";
import { navigate } from "../router.js";
import { getCategories, requestToken, resetToken } from "../api.js";

const app = document.querySelector(".app");

export const home = async () => {
  app.innerHTML = "";
  const buildForm = (shape, handler, liveValidator) => {
    const formElement = document.createElement("form");
    formElement.addEventListener("submit", handler);
    formElement.className = "form";

    shape.forEach((element) => {
      if (element.inputType === "text") {
        const input = document.createElement("div");
        input.className = "form-input-container";
        input.innerHTML = `
        <label>${element.label}</label>
                    <input class=${
                      element.className
                    } type="text" maxlength="20" placeholder="${
          element?.placeholder || ""
        }">
        `;

        const textInput = input.querySelector("input");
        textInput.addEventListener("input", liveValidator);
        formElement.append(input);
      } else if (element.inputType === "select") {
        const input = document.createElement("div");
        input.className = "form-input-container";
        input.innerHTML = `
        <label>${element.label}</label>
         <select class=${element.className}>
            ${element.options.map((option) => {
              return `<option value=${option.value}>
                            ${option.label}
                        </option>
                `;
            })}
        </select>
        `;

        const selectInput = input.querySelector("select");
        selectInput.addEventListener("change", liveValidator);
        formElement.append(input);
      }
    });

    const submitBtn = document.createElement("button");
    submitBtn.className = "button btn-submit btn-app";
    submitBtn.type = "submit";
    submitBtn.innerText = "Start Quiz";
    submitBtn.disabled = true;
    formElement.append(submitBtn);
    return formElement;
  };

  // FORM SUBMIT ACTION
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(e);
    const name = e.target[0].value;
    const amount = e.target[1].value;
    const difficulty = e.target[2].value;
    const type = e.target[3].value;
    const category = e.target[4].value;
    navigate(
      `/quiz?name=${name}&amount=${amount}&difficulty=${difficulty}&type=${type}&category=${category}`
    );

    const event = new Event("popstate");
    window.dispatchEvent(event);
  };

  // FORM INPUT VALIDATION
  const liveValidator = (event) => {
    const submitBtn = document.querySelector(".btn-submit");
    const value = event.target.value;
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]*$/;
    if (event.target.type === "text") {
      submitBtn.disabled = value === "" || !regex.test(value);
    }
  };

  try {
    const response = await getCategories();
    const categories = response.trivia_categories.map((categoriesObj) => ({
      value: categoriesObj.id,
      label: categoriesObj.name,
    }));

    const categoryInputObj = formShape.find(
      (element) => element.label === "Select Category"
    );
    categoryInputObj.options = [{ value: "Any", label: "Any" }, ...categories];
    const form = buildForm(formShape, submitHandler, liveValidator);
    app.append(form);
    const storedToken = localStorage.getItem("token");
    await resetToken(storedToken);
    const newTOkenObj = await requestToken();
    localStorage.setItem("token", newTOkenObj.token);
  } catch (error) {
    console.log(error);
  }
};

export default home;
