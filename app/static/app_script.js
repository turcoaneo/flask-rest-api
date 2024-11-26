import {
    WEB_URL,
    MISSING_ID,
    submitButton,
    userInputElement,
    cleanTable,
    buildAppTable,
    getFormData,
    clearFormData
} from "./utils.js";
import {apiCall} from "./rest_api.js";

let searchId = MISSING_ID;

const createSearchItemEventListener = async () => {
    const submitButton = document.getElementById('find-button');
    submitButton.addEventListener('click', async () => {
        await getItem(userInputElement);
    })
}

const createAddItemEventListener = async () => {
    submitButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let data = getFormData();
        await createRecipe(data);
        clearFormData();
    })
}

const createUpdateItemEventListener = async () => {
    submitButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let data = getFormData();
        await updateRecipe(data);
        clearFormData();
    })
}

const createBtnEnableFormEventListener = async () => {
    const addButton = document.getElementById('toggle-show-create-form-button');
    addButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await addOrClearFormDiv(addButton);
    })
}

const enableCreateButtonEventListeners = async () => {
    const name = document.getElementById('name')
    const ingredients = document.getElementById('ingredients')
    const instructions = document.getElementById('instructions')

    function updateSubmitBtn() {
        const nameValue = name.value.trim();
        const ingredientsValue = ingredients.value.trim();
        const instructionsValue = instructions.value.trim();
        if (nameValue && ingredientsValue && instructionsValue) {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute('disabled', 'disabled');
        }
    }

    name.addEventListener('mouseout', updateSubmitBtn);
    ingredients.addEventListener('mouseout', updateSubmitBtn);
    instructions.addEventListener('mouseout', updateSubmitBtn);
}

const getItem = async (userInput) => {
    userInputElement.innerText = "";
    let id = userInput.value;
    const promise = apiCall(id, WEB_URL, "GET", null);
    promise
        .then((result) => {
            cleanTable();
            searchId = id !== "" ? id : MISSING_ID;
            return buildAppTable(result);
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const createRecipe = (userInput) => {
    const promise = apiCall(null, WEB_URL, "POST", userInput);
    promise
        .then((result) => {
            getItem("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const updateRecipe = (userInput) => {
    // console.log(userInput);
    const promise = apiCall(searchId, WEB_URL, "PUT", userInput);
    promise
        .then((result) => {
            getItem("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

function addOrClearFormDiv(addButton) {
    const divCreateForm = document.getElementById('div-create-form');
    if (addButton.innerText === "+") {
        divCreateForm.style.display = "block";
        addButton.innerText = "-";
    } else {
        divCreateForm.style.display = "none";
        addButton.innerText = "+";
    }
}

const deleteRecipe = (id) => {
    const promise = apiCall(id, WEB_URL, "DELETE", null);
    promise
        .then((result) => {
            cleanTable();
            searchId = id !== "" ? id : MISSING_ID;
            return buildAppTable(result);
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}


window.onload = () => {
    createSearchItemEventListener().then(() => console.log("Search item event listener created!"));
    createAddItemEventListener().then(() => console.log("Add item event listener created!"));
    createUpdateItemEventListener().then(() => console.log("Update item event listener created!"));
    createBtnEnableFormEventListener().then(() => console.log("Plus-minus button item event listener created!"));
    enableCreateButtonEventListeners().then(() => console.log("Enable submit button event listeners created!"));
}