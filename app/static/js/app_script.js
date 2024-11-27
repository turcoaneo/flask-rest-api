import {
    buildAppTable, cleanTable, clearFormData, getCreateFormData, getRecipeIdFromElementId, getUpdateFormData,
    MISSING_ID, WEB_URL, IDLE_TIME_SEC, APP_TIMEOUT_MILLI, recipeEndpoint, submitButton, userInputElement,
} from "./utils.js";
import {apiCall} from "./rest_api.js";
import {getUserInput, setCell, toggleButtons} from "./utils_update.js";

let searchId = MISSING_ID;
let startTime = new Date().getTime();

const createDeleteItemEventListener = async () => {
    const deleteButtonList = document.querySelectorAll('.recipe-delete');
    deleteButtonList.forEach(deleteButton => {
        deleteButton.addEventListener('click', async () => {
            searchId = getRecipeIdFromElementId(deleteButton);
            // console.log("Update button: ", searchId);
            await deleteRecipe();
        })
    })
}

const createUpdateItemEventListener = async () => {
    const updateButtonList = document.querySelectorAll(".recipe-edit");

    function setNewText(formMap, id) {
        formMap.set(id, document.getElementById("textarea-" + id).value);
    }

    updateButtonListener(updateButtonList, setNewText);
}

const checkServerItemEventListener = async () => {
    const checkingDiv = document.getElementById("div-two-actions");
    checkingDiv.addEventListener('mouseover', async () => {
        let stopTime = new Date().getTime();
        let elapsedTime = (stopTime - startTime) / 1000;
        // console.log(elapsedTime);
        if (elapsedTime > IDLE_TIME_SEC) {
            startTime = stopTime;
            console.log("Checking server as having been idle for: ", elapsedTime);
            setTimeout(await getHelloWorld, APP_TIMEOUT_MILLI);
        }
    })
}

const createSearchItemEventListener = async () => {
    const findButton = document.getElementById('find-button');
    findButton.addEventListener('click', async () => {
        await getItem(userInputElement);
    })
}

const createAddItemEventListener = async () => {
    submitButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let data = getCreateFormData();
        await createRecipe(data);
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
    let id = userInput.value;
    const promise = apiCall(id, WEB_URL, recipeEndpoint, "GET", null);
    promise
        .then((result) => {
            cleanTable();
            buildAppTable(result);
            userInputElement.value = "";
            createUpdateItemEventListener().then(() => console.log("Update item event listener created!"));
            createDeleteItemEventListener().then(() => console.log("Delete button event listeners created!"));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const getHelloWorld = async () => {
    const promise = apiCall(null, WEB_URL, "hello", "GET", null);
    promise
        .then((result) => {
            console.log(result);
            document.getElementById("app-title").innerText = "Recipe form";
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
            document.getElementById("app-title").innerText = "Server not running";
        });
}

const createRecipe = (userInput) => {
    const promise = apiCall(null, WEB_URL, recipeEndpoint, "POST", userInput);
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
    const promise = apiCall(searchId, WEB_URL, recipeEndpoint, "PUT", userInput);
    promise
        .then((result) => {
            getItem("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const deleteRecipe = () => {
    const promise = apiCall(searchId, WEB_URL, recipeEndpoint, "DELETE", null);
    promise
        .then(() => {
            getItem("").then(() => console.log("Re-fetching after delete"));
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

function updateButtonListener(updateButtonList, setNewText) {
    updateButtonList.forEach(updateButton => {
        updateButton.addEventListener('click', async (evt) => {
            evt.preventDefault();
            searchId = getRecipeIdFromElementId(updateButton);
            // console.log("Update button: ", searchId);
            const resultTable = document.getElementById("app-table-result");
            for (let i = 1; i < resultTable.rows.length; i++) {
                let row = resultTable.rows[i];
                let rowId = getRecipeIdFromElementId(row);
                if (searchId === rowId) {
                    // console.log("Tr: " + rowId);
                    for (let j = 1; j < row.cells.length - 1; j++) {
                        let cell = row.cells[j];
                        setCell(cell, getRecipeIdFromElementId(cell));
                    }
                    const addNewBtn = document.getElementById("Add-" + searchId);
                    toggleButtons(updateButton, addNewBtn);

                    addNewBtn.addEventListener('click', async () => {
                        const userInput = getUpdateFormData(getUserInput(setNewText));
                        toggleButtons(addNewBtn, updateButton);
                        await updateRecipe(userInput);
                    });
                }
            }
        })
    })
}


window.onload = () => {
    checkServerItemEventListener().then(() => console.log("Server check event listener created!"));
    createSearchItemEventListener().then(() => console.log("Search item event listener created!"));
    createAddItemEventListener().then(() => console.log("Add item event listener created!"));
    createBtnEnableFormEventListener().then(() => console.log("Plus-minus button item event listener created!"));
    enableCreateButtonEventListeners().then(() => console.log("Enable submit button event listeners created!"));
}