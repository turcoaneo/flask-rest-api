import {WEB_URL, MISSING_ID} from "./utils.js";
import {apiCall} from "./rest_api.js";

let searchId = MISSING_ID;

const userInputElement = document.getElementById("input-text");

function processResult(result, table) {
    let row = document.createElement('tr');
    row.classList.add('app-row');

    let colId = document.createElement('td');
    colId.innerText = result["id"];
    let colName = document.createElement('td');
    colName.innerText = result["name"];
    let colIngredients = document.createElement('td');
    // noinspection JSValidateTypes
    colIngredients.innerText = result["ingredients"];
    let colInstructions = document.createElement('td');
    // noinspection JSValidateTypes
    colInstructions.innerText = result["instructions"];

    row.appendChild(colId);
    row.appendChild(colName);
    row.appendChild(colIngredients);
    row.appendChild(colInstructions);

    table.appendChild(row);
}

const buildAppTable = (results) => {
    let table = document.getElementById('app-table-result');

    if (results instanceof Array) {
        results.forEach(result => {
            processResult(result, table);
        })
    } else {
        processResult(results, table);
    }
    rows().then(() => console.log("Successful select table row event listener!"));
}

const cleanTable = () => {
    let rows = document.querySelectorAll('.app-row');
    rows.forEach(row => {
        row.remove();
    })
}

const updateResults = async (userInput) => {
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

const searchResult = async () => {
    const submitButton = document.getElementById('find-button');

    submitButton.addEventListener('click', async () => {
        await updateResults(userInputElement);
    })
}

function clearFormData() {
    document.getElementById("create-form").reset();
}

function getFormData() {
    let form = document.forms["create-form"];

    let formData = new FormData(form);

    let data = {};

    for (let [key, prop] of formData) {
        data[key] = prop;
        if (prop === "") {
            delete data[key];
        }
        if (key === "ingredients") {
            data[key] = prop.split(',');
        }
    }

    data = JSON.stringify(data, null, 2);

    console.log(data);
    return data;
}

const create = async () => {
    const elementId = "create-button";
    const submitButton = document.getElementById(elementId);

    submitButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let data = getFormData();
        await createRecipe(data);
        clearFormData();
    })
}

const createRecipe = (userInput) => {
    const promise = apiCall(null, WEB_URL, "POST", userInput);
    promise
        .then((result) => {
            updateResults("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

const update = async () => {
    const elementId = "update-button";
    const submitButton = document.getElementById(elementId);

    submitButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let data = getFormData();
        await updateRecipe(data);
        clearFormData();
    })
}

function resetComponents() {
    setFormComponents({
        "div-create-form": "none",
        "create-button": "block",
        "update-button": "none"
    });
    let tooltip = document.querySelector("#tooltip-update");
    tooltip.style.display = "none";
    document.getElementById("add-button").innerText = "+";
}

function clearSearchForm() {
    const inputSearch = document.getElementById("input-text");
    inputSearch.innerText = "";
}

const updateRecipe = (userInput) => {
    // console.log(userInput);
    const promise = apiCall(searchId, WEB_URL, "PUT", userInput);
    promise
        .then((result) => {
            updateResults("").then(() => console.log(result));
        })
        .catch((error) => {
            console.error(`Could not get result: ${error}`);
        });
}

function addOrClearDiv(addButton) {
    const divCreateForm = document.getElementById('div-create-form');
    if (addButton.innerText === "+") {
        divCreateForm.style.display = "block";
        addButton.innerText = "-";
    } else {
        divCreateForm.style.display = "none";
        addButton.innerText = "+";
    }
}

const insert = async () => {
    const addButton = document.getElementById('add-button');
    addButton.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await addOrClearDiv(addButton);
    })
}
const rows = async () => {
    let trs = document.querySelectorAll("#app-table-result tr");
    for (let i = 1; i < trs.length; i++) {
        (function (e) {
            trs[e].addEventListener("dblclick", function (ev) {
                if (ev.altKey === true) {
                    let id = this.querySelectorAll("*")[0].innerHTML.trim();
                    change(id);
                }
            }, false);
        })(i);
        (function (e) {
            trs[e].addEventListener("mouseover", function () {
                let selectors;
                if (searchId !== MISSING_ID) {
                    selectors = '#tooltip-update';
                } else {
                    selectors = '#tooltip-remove';
                }
                let tooltip = document.querySelector(selectors);
                tooltip.style.display = "block";
                let bounds = document.querySelector('#app-table-result').getBoundingClientRect();

                tooltip.style.left = bounds.left + 30 + 'px';
                tooltip.style.top = bounds.top - 5 + 'px';
                setTimeout(function () {
                    tooltip.style.display = "none";
                }, 3000);
            }, false);
        })(i);
        (function (e) {
            trs[e].addEventListener("mouseout", function () {
                // console.log("Mouse out");
                let tooltip = document.querySelector('#tooltip-remove');
                tooltip.style.display = "none";
            }, false);
        })(i);
    }
}

function setFormComponents(dict) {
    for (const key of Object.keys(dict)) {
        const elementById = document.getElementById(key);
        elementById.style.display = dict[key];
        // console.log(key + " -> " + dict[key])
    }
}

const change = async (id) => {
    if (searchId !== MISSING_ID) {
        setFormComponents({
            "div-create-form": "block",
            "create-button": "none",
            "update-button": "block"
        });
        const addButton = document.getElementById('add-button');
        addButton.innerText = "-";
    } else {
        await deleteRecipe(id);
    }
}

const deleteRecipe = (id) => {
    // fetch(`http://127.0.0.1:5000/recipe/${id}`, {
    //     method: 'DELETE', headers: new Headers({
    //         'content-type': 'application/json', 'Access-Control-Allow-Origin': WEB_URL
    //     }), cache: 'no-cache',
    // }).then(async (response) => {
    //     cleanTable();
    //     await fetchResult("");
    //     console.log(response);
    // }).catch((error) => {
    //     console.error('Something went wrong.', error);
    // });
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

const enableButton = async (elementId) => {
    const submitBtn = document.getElementById(elementId);
    const name = document.getElementById('name')
    const ingredients = document.getElementById('ingredients')
    const instructions = document.getElementById('instructions')

    function updateSubmitBtn() {
        const nameValue = name.value.trim();
        const ingredientsValue = ingredients.value.trim();
        const instructionsValue = instructions.value.trim();
        if (elementId === 'create-button') {
            if (nameValue && ingredientsValue && instructionsValue) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
            }
        }
        if (elementId === 'update-button') {
            if (nameValue || ingredientsValue || instructionsValue) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
            }
        }
    }

    name.addEventListener('mouseout', updateSubmitBtn);
    ingredients.addEventListener('mouseout', updateSubmitBtn);
    instructions.addEventListener('mouseout', updateSubmitBtn);
}


window.onload = () => {
    searchResult().then(() => console.log("Successful init!"));
    create().then(() => console.log("Successful creation event listener!"));
    update().then(() => console.log("Successful update event listener!"));
    insert().then(() => console.log("Successful plus button event listener!"));
    enableButton("update-button").then(() => console.log("Successful create button event listener!"));
    enableButton("create-button").then(() => console.log("Successful update button event listener!"));
}