const fetchResult = (id) => {
    let endpoint = "http://127.0.0.1:5000/recipe";
    if (id !== "") {
        endpoint = `http://127.0.0.1:5000/recipe/${id}`;
    }
    fetch(endpoint, {
        method: 'GET',
        headers: new Headers({
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': 'http://127.0.0.1:5000/'
        }),
        cache: 'no-cache',
    }).then(async (response) => {
        if (response.ok) {
            let result = await response.json();
            return buildAppTable(result);
        } else {
            let result = {};
            result["id"] = id;
            result["name"] = response.status;
            result["ingredients"] = response.statusText;
            result["instructions"] = response.url;
            return buildAppTable(result);
        }
    }).catch((error) => {
        console.error('Something went wrong.', error);
    });
}

function processResult(result, table) {
    let row = document.createElement('tr');
    row.classList.add('app-row');

    let colId = document.createElement('td');
    colId.innerText = result["id"];
    let colName = document.createElement('td');
    colName.innerText = result["name"];
    let colIngredients = document.createElement('td');
    colIngredients.innerText = result["ingredients"];
    let colInstructions = document.createElement('td');
    colInstructions.innerText = result["instructions"];

    row.appendChild(colId);
    row.appendChild(colName);
    row.appendChild(colIngredients);
    row.appendChild(colInstructions);

    table.appendChild(row);
}

const buildAppTable = (results) => {
    let table = document.getElementById('app-table');

    if (results instanceof Array) {
        results.forEach(result => {
            processResult(result, table);
        })
    } else {
        processResult(results, table);
    }
}

const cleanTable = () => {
    let rows = document.querySelectorAll('.app-row');
    rows.forEach(row => {
        row.remove();
    })
}

const updateResults = async (userInput) => {
    cleanTable();
    await fetchResult(userInput.value);
}

const init = async () => {
    const submitButton = document.getElementById('find-button');
    const userInput = document.getElementById('input-text');

    submitButton.addEventListener('click', async () => {
        await updateResults(userInput);
    })
}

window.onload = () => {
    init().then(() => console.log("Successful init!"));
}