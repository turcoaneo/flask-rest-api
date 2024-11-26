export const WEB_URL = "http://127.0.0.1:5000/";
export const MISSING_ID = -1;

export const userInputElement = document.getElementById("input-text");
export const submitButton = document.getElementById("create-button");

export const cleanTable = () => {
    let rows = document.querySelectorAll('.app-row');
    rows.forEach(row => {
        row.remove();
    })
}

export function clearFormData() {
    document.getElementById("create-form").reset();
}

export function getFormData() {
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

    data = JSON.stringify(data);
    // console.log(data);
    return data;
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

const processResult = (result, table) => {
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
    let colActions = document.createElement('td');
    colActions.append(ul_buttons(result["id"]));

    row.appendChild(colId);
    row.appendChild(colName);
    row.appendChild(colIngredients);
    row.appendChild(colInstructions);
    row.appendChild(colActions);

    table.appendChild(row);
}

const ul_buttons = (id) => {
    let btnList = document.createElement("ul");
    btnList.classList.add("list-inline");
    btnList.classList.add("m-0");
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
        function addBtnBackgroundColor() {
            switch (btnTitle) {
                case "Edit":
                    btn.classList.add("btn-success");
                    break;
                case "Delete":
                    btn.classList.add("btn-danger");
                    break;
                default:
                    btn.classList.add("btn-primary");
            }
        }

        let btn = document.createElement("button");

        btn.setAttribute("title", btnTitle);
        btn.setAttribute("id", btnTitle + "-" + id);
        btn.setAttribute("type", "button");
        btn.setAttribute("data-toggle", "tooltip");
        btn.setAttribute("data-placement", "top");

        btn.classList.add("btn");
        btn.classList.add("btn-sm");
        btn.classList.add("rounded-2");
        addBtnBackgroundColor();

        let img = document.createElement("img");
        img.setAttribute("src", imgSrc);

        btn.appendChild(img);
        return btn;
    }
}