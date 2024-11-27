export const WEB_URL = "http://127.0.0.1:5000/";
export const recipeEndpoint = "recipe";
export const MISSING_ID = -1;
export const IDLE_TIME_SEC = 30;
export const APP_TIMEOUT_MILLI = 2000;

export const userInputElement = document.getElementById("input-text");
export const submitButton = document.getElementById("create-button");

export const cleanTable = () => {
    let rows = document.querySelectorAll(".app-row");
    rows.forEach(row => {
        row.remove();
    })
}

export const getRecipeIdFromElementId = (element) => {
    return element.getAttribute("id").split("-")[1];
}

export const clearFormData = () => {
    document.getElementById("create-form").reset();
}

export const getUpdateFormData = (form) => {
    return prepareFormData(form);
}

export const getCreateFormData = () => {
    let form = document.forms["create-form"];
    return getFormData(form);
}

export const buildAppTable = (results) => {
    let table = document.getElementById('app-table-result');
    if (results instanceof Array) {
        results.forEach(result => {
            processResult(result, table);
        })
    } else {
        processResult(results, table);
    }
}

function prepareFormData(formData) {
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

    // console.log(data);
    return JSON.stringify(data);
}

const getFormData = (form) => {
    let formData = new FormData(form);
    return prepareFormData(formData);
}

const processResult = (result, table) => {
    let row = document.createElement('tr');
    row.classList.add("app-row");
    const resultId = result["id"];
    row.setAttribute("id", "tr-" + resultId);

    setCol("id")
    setCol("name");
    setCol("ingredients");
    setCol("instructions");

    let colActions = document.createElement('td');
    colActions.append(ul_buttons(resultId));
    row.appendChild(colActions);

    table.appendChild(row);

    function setCol(col) {
        let td = document.createElement('td');
        td.setAttribute("id", "td-" + col);
        td.innerText = result[col];
        row.appendChild(td);
    }
}

const ul_buttons = (id) => {
    let btnList = document.createElement("ul");
    btnList.classList.add("list-inline");
    btnList.classList.add("m-1");
    btnList.setAttribute("id", "ul-buttons-" + id);

    createLi(createBtn(id, "Add", "../static/icons/table.svg"));
    createLi(createBtn(id, "Edit", "../static/icons/pencil-square.svg"));
    createLi(createBtn(id, "Delete", "../static/icons/trash.svg"));

    return btnList;

    function createLi(btn) {
        let li = document.createElement("li");
        li.classList.add("list-inline-item");
        li.appendChild(btn);
        btnList.appendChild(li);
    }

    function createBtn(id, btnTitle, imgSrc) {
        let btn = document.createElement("button");

        btn.setAttribute("title", btnTitle);
        btn.setAttribute("id", btnTitle + "-" + id);
        btn.setAttribute("type", "button");

        btn.classList.add("btn");
        btn.classList.add("btn-sm");
        btn.classList.add("btn-outline-primary");
        btn.classList.add("py-0");
        btn.classList.add("rounded-2");
        addBtnCustomAttributes();

        let img = document.createElement("img");
        img.setAttribute("src", imgSrc);

        btn.appendChild(img);
        return btn;

        function addBtnCustomAttributes() {
            switch (btnTitle) {
                case "Edit":
                    btn.classList.add("btn-success");
                    btn.classList.add("recipe-edit");
                    break;
                case "Delete":
                    btn.classList.add("btn-danger");
                    btn.classList.add("recipe-delete");
                    break;
                default:
                    btn.classList.add("btn-primary");
                    btn.classList.add("recipe-add-edit");
            }
        }

    }
}