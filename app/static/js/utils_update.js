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

export const getUserInput = (setNewText, cols) => {
    let formMap = new Map();
    setNewText(formMap, cols[0]);
    setNewText(formMap, cols[1]);
    setNewText(formMap, cols[2]);
    return formMap;
}

export const toggleButtons = (visibleBtn, hiddenBtn) => {
    visibleBtn.style.display = "none";
    hiddenBtn.style.display = "block";
}

export const resetTableRow = (row, newObj, tdIdPrefix, idSep, cols) => {
    row.children[tdIdPrefix + idSep + cols[0]].innerText = newObj["name"];
    row.children[tdIdPrefix + idSep + cols[1]].innerText = newObj["ingredients"];
    row.children[tdIdPrefix + idSep + cols[2]].innerText = newObj["instructions"];
}