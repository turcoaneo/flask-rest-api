export const setCell = (cell, cellId, idSep, textfieldName, previousValues) => {
    const content = cell.innerText;

    // console.log("Td: ", content);
    const textField = document.createElement(textfieldName);
    textField.setAttribute("id", textfieldName + idSep + cellId);
    textField.style.width = cell.clientWidth - 2 + 'px';
    textField.style.height = cell.clientHeight - 2 + 'px';
    textField.innerText = content;
    cell.innerHTML = null;
    cell.appendChild(textField);
    if (cellId === "ingredients") {
        previousValues[cellId] = content.split(",").map(function (item) {
            return item.trim();
        });
    } else {
        previousValues[cellId] = content;
    }
}

export const getUserInput = (setNewText) => {
    let formMap = new Map();
    setNewText(formMap, "name");
    setNewText(formMap, "ingredients");
    setNewText(formMap, "instructions");
    return formMap;
}

export const toggleButtons = (visibleBtn, hiddenBtn) => {
    visibleBtn.style.display = "none";
    hiddenBtn.style.display = "block";
}

export const resetTableRow = (row, newObj, tdIdPrefix, idSep) => {
    row.children[tdIdPrefix + idSep + "name"].innerText = newObj["name"];
    row.children[tdIdPrefix + idSep + "ingredients"].innerText = newObj["ingredients"];
    row.children[tdIdPrefix + idSep + "instructions"].innerText = newObj["instructions"];
}