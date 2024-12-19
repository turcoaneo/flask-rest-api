import {
    buildAppTable,
    cleanTable,
    clearFormData,
    getCreateFormData,
    getRecipeIdFromElementId,
    getUpdateFormData,
    deepEqual,
    resetTableRowForm,
    addOrClearFormDiv,
    MISSING_ID,
    WEB_URL_LOCAL,
    WEB_URL,
    IDLE_TIME_SEC,
    APP_TIMEOUT_MILLI,
    ID_SEP,
    EDIT_TEXTFIELD,
    BTN_TEXT_ADD,
    TD_ID_PREFIX,
    COL_NAME,
    COL_INGREDIENTS,
    COL_INSTRUCTIONS,
    RECIPE_ENDPOINT,
    SPLITTER,
    DISPLAY_FLEX,
    submitButton,
    userInputElement,
    appTitle,
    imgSrcRootFolder,
} from "./utils.js";
import {apiCall} from "./rest_api.js";
import {
    DISPLAY_BLOCK,
    DISPLAY_NONE,
    getUserInput,
    setCellAndRecordPreviousValue,
    toggleButtons
} from "./utils_update.js";

let searchId = MISSING_ID;
let startTime = new Date().getTime();
let webUrl = WEB_URL;

window.onload = () => {
    getEnvAndInitApp().then(() => console.log("Got ENV: ", webUrl));
}

const getEnvAndInitApp = async () => {
    appTitle.innerText = "Loading ENV... Please wait!";
    toggleDivsBeforeLoading(DISPLAY_NONE);
    const promise = apiCall(null, webUrl, "hello", "GET", null);
    promise
        .then((result) => {
            appTitle.innerText = "Recipe form";
            toggleDivsBeforeLoading(DISPLAY_FLEX);
            console.log(result);
            initApp();
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
            webUrl = WEB_URL_LOCAL;
            console.log("Switching to: ", webUrl);
            const promise = apiCall(null, WEB_URL_LOCAL, "hello", "GET", null);
            promise
                .then((result) => {
                    appTitle.innerText = "Recipe form";
                    toggleDivsBeforeLoading(DISPLAY_FLEX);
                    initApp();
                    console.log(result);
                })
                .catch((error) => {
                    console.error(`Could not get result: ${error}`);
                });
        });

    function toggleDivsBeforeLoading(toggle) {
        document.getElementById("div-two-actions").style.display = toggle;
    }
}

const getItem = async (userInput) => {
    let id = userInput.value;
    const promise = apiCall(id, webUrl, RECIPE_ENDPOINT, "GET", null);
    promise
        .then((result) => {
            cleanTable();
            buildAppTable(result, imgSrcRootFolder);
            userInputElement.value = "";
            createUpdateItemEventListener().then(() => console.log("Update item event listener created!"));
            createDeleteItemEventListener().then(() => console.log("Delete button event listeners created!"));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const createRecipe = (userInput) => {
    const promise = apiCall(null, webUrl, RECIPE_ENDPOINT, "POST", userInput);
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
    const promise = apiCall(searchId, webUrl, RECIPE_ENDPOINT, "PUT", userInput);
    promise
        .then((result) => {
            getItem("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const deleteRecipe = () => {
    const promise = apiCall(searchId, webUrl, RECIPE_ENDPOINT, "DELETE", null);
    promise
        .then(() => {
            getItem("").then(() => console.log("Re-fetching after delete"));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const createDeleteItemEventListener = async () => {
    const deleteButtonList = document.querySelectorAll('.recipe-delete');
    deleteButtonList.forEach(deleteButton => {
        deleteButton.addEventListener('click', onCLickHandlerDelete(deleteButton))
    })
}

const createUpdateItemEventListener = async () => {
    const updateButtonList = document.querySelectorAll(".recipe-edit");
    updateButtonListener(updateButtonList);
}

const checkServerItemEventListener = async () => {
    const checkingDiv = document.getElementById("app");
    checkingDiv.addEventListener('mouseover', async () => {
        let stopTime = new Date().getTime();
        let elapsedTime = (stopTime - startTime) / 1000;
        // console.log(elapsedTime);
        if (elapsedTime > IDLE_TIME_SEC) {
            startTime = stopTime;
            console.log("Checking server as having been idle for: ", elapsedTime);
            setTimeout(await checkServerRunning, APP_TIMEOUT_MILLI);
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
        addOrClearFormDiv(addButton, DISPLAY_BLOCK, DISPLAY_NONE);
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

function updateButtonListener(updateButtonList) {
    updateButtonList.forEach(updateButton => {
        updateButton.addEventListener('click', onClickHandlerUpdate(updateButton));
    })
}

function createNewItemBtnEventListener(sendUpdateBtn, updateButton, prevObj, row) {
    sendUpdateBtn.addEventListener('click', onClickHandlerAdd(row, sendUpdateBtn, updateButton, prevObj));
}

function onCLickHandlerDelete(deleteButton) {
    return async () => {
        searchId = getRecipeIdFromElementId(deleteButton);
        // console.log("Delete button: ", searchId);
        await deleteRecipe();
    };
}

function onClickHandlerUpdate(updateButton) {
    return async () => {
        searchId = getRecipeIdFromElementId(updateButton);
        // console.log("Update button: ", searchId);
        const resultTable = document.getElementById("app-table-result");
        const tableRowSize = resultTable.rows.length;
        for (let i = 1; i < tableRowSize; i++) {
            let row = resultTable.rows[i];
            let prevObj = processRowForUpdate(row);
            if (Object.keys(prevObj).length !== 0) {
                const sendUpdateBtn = document.getElementById(BTN_TEXT_ADD + ID_SEP + searchId);
                toggleButtons(updateButton, sendUpdateBtn);
                createNewItemBtnEventListener(sendUpdateBtn, updateButton, prevObj, row);
                break;
            }
        }
    };
}

function onClickHandlerAdd(row, sendUpdateBtn, updateButton, prevObj) {
    return async () => {
        if (sendUpdateBtn.style.display === DISPLAY_NONE) {
            return;
        }
        const userInput = getUpdateFormData(
            getUserInput([COL_NAME, COL_INGREDIENTS, COL_INSTRUCTIONS], EDIT_TEXTFIELD, ID_SEP));
        toggleButtons(sendUpdateBtn, updateButton);
        const newObj = JSON.parse(userInput);
        const hasNotChanged = deepEqual(newObj, prevObj);
        if (hasNotChanged) {
            console.log("Prev values not changed: ", prevObj);
            resetTableRowForm(row, newObj, TD_ID_PREFIX, ID_SEP,
                [COL_NAME, COL_INGREDIENTS, COL_INSTRUCTIONS]);
        } else {
            await updateRecipe(userInput);
        }
    };
}

function processRowForUpdate(row) {
    let rowId = getRecipeIdFromElementId(row);
    const prevObj = {};
    if (searchId === rowId) {
        // console.log("Tr: " + rowId);
        for (let j = 1; j < row.cells.length - 1; j++) {
            let cell = row.cells[j];
            setCellAndRecordPreviousValue(cell, getRecipeIdFromElementId(cell), ID_SEP, EDIT_TEXTFIELD, prevObj,
                SPLITTER, COL_INGREDIENTS);
        }
    }
    return prevObj;
}

const initApp = () => {
    checkServerItemEventListener().then(() => console.log("Server check event listener created!"));
    createSearchItemEventListener().then(() => console.log("Search item event listener created!"));
    createAddItemEventListener().then(() => console.log("Add item event listener created!"));
    createBtnEnableFormEventListener().then(() => console.log("Plus-minus button item event listener created!"));
    enableCreateButtonEventListeners().then(() => console.log("Enable submit button event listeners created!"));
}

const checkServerRunning = async () => {
    const promise = apiCall(null, webUrl, "hello", "GET", null);
    promise
        .then((result) => {
            console.log(result);
            appTitle.innerText = "Recipe form";
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
            appTitle.innerText = "Server not running";
        });
}