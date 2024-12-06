const PORT = "80";
export const WEB_URL = "http://13.61.40.196:" + PORT + "/";
export const RECIPE_ENDPOINT = "recipe";
export const MISSING_ID = -1;
export const IDLE_TIME_SEC = 30;
export const APP_TIMEOUT_MILLI = 2000;
export const BTN_PLUS = "+";
export const BTN_MINUS = "-";
export const ID_SEP = "-";
export const EDIT_TEXTFIELD = "textarea";

export const BTN_TEXT_ADD = "Add";
const BTN_TEXT_DELETE = "Delete";
const BTN_TEXT_EDIT = "Edit";

const COL_ID = "id";
export const COL_NAME = "name";
export const COL_INGREDIENTS = "ingredients";
export const COL_INSTRUCTIONS = "instructions";
export const SPLITTER = ",";

export const userInputElement = document.getElementById("input-text");
export const submitButton = document.getElementById("create-button");

export const TD_ID_PREFIX = "td";

export const addOrClearFormDiv = (addButton, showDivStyle, hideDivStyle) => {
    const divCreateForm = document.getElementById('div-create-form');
    if (addButton.innerText === BTN_PLUS) {
        divCreateForm.style.display = showDivStyle;
        addButton.innerText = BTN_MINUS;
    } else {
        divCreateForm.style.display = hideDivStyle;
        addButton.innerText = BTN_PLUS;
    }
}

export const deepEqual = (x, y) => {
    const ok = Object.keys, tx = typeof x, ty = typeof y, cx = x.constructor, cy = y.constructor;
    return x && y
    && tx === 'object'
    && tx === ty
    && cx === cy ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}

export const cleanTable = () => {
    let rows = document.querySelectorAll(".app-row");
    rows.forEach(row => {
        row.remove();
    })
}

export const getRecipeIdFromElementId = (element) => {
    return element.getAttribute("id").split(ID_SEP)[1];
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
        if (key === COL_INGREDIENTS) {
            data[key] = prop.split(',').map(function (item) {
                return item.trim();
            });
        }
    }

    // console.log(data);
    return JSON.stringify(data);
}

const getFormData = (form) => {
    let formData = new FormData(form);
    return prepareFormData(formData);
}

function getFormattedContent(words) {
    if (Array.isArray(words)) {
        let content = "";
        const spacer = " ";
        length = words.length;
        for (let i = 0; i < length - 1; i++) {
            content += words[i].trim() + SPLITTER + spacer;
        }
        content += words[length - 1];
        return content;
    }
    return words;
}

export const resetTableRowForm = (row, newObj, tdIdPrefix, idSep, cols) => {
    row.children[tdIdPrefix + idSep + cols[0]].innerText = newObj[cols[0]];
    row.children[tdIdPrefix + idSep + cols[1]].innerText = getFormattedContent(newObj[cols[1]]);
    row.children[tdIdPrefix + idSep + cols[2]].innerText = newObj[cols[2]];
}

const processResult = (result, table) => {
    let row = document.createElement('tr');
    row.classList.add("app-row");
    const resultId = result["id"];
    row.setAttribute("id", "tr" + ID_SEP + resultId);

    setCols(result, row, TD_ID_PREFIX);

    let colActions = document.createElement('td');
    colActions.append(ul_buttons(resultId));
    row.appendChild(colActions);

    table.appendChild(row);

    function setCols(result, row, tdIdPrefix) {
        const cols = [COL_ID, COL_NAME, COL_INGREDIENTS, COL_INSTRUCTIONS];
        cols.forEach(col => {
            let td = document.createElement('td');
            td.setAttribute("id", tdIdPrefix + ID_SEP + col);
            td.innerText = getFormattedContent(result[col]);
            // td.innerText = result[col];
            row.appendChild(td);
        })
    }
}

const ul_buttons = (id) => {
    let btnList = document.createElement("ul");
    btnList.classList.add("list-inline");
    btnList.classList.add("m-1");
    btnList.setAttribute("id", "ul-buttons" + ID_SEP + id);

    createLi(createBtn(id, BTN_TEXT_ADD, "../static/icons/table.svg"));
    createLi(createBtn(id, BTN_TEXT_EDIT, "../static/icons/pencil-square.svg"));
    createLi(createBtn(id, BTN_TEXT_DELETE, "../static/icons/trash.svg"));

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
        btn.setAttribute("id", btnTitle + ID_SEP + id);
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
                case BTN_TEXT_EDIT:
                    btn.classList.add("btn-success");
                    btn.classList.add("recipe-edit");
                    break;
                case BTN_TEXT_DELETE:
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