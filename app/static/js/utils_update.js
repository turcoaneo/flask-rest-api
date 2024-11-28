export const setCell = (cell, cellId, idSep) => {
    const content = cell.innerText;

    // console.log("Td: ", content);
    const textField = document.createElement(EDIT_TEXTFIELD);
    textField.setAttribute("id", EDIT_TEXTFIELD + idSep + cellId);
    textField.style.width = cell.clientWidth - 2 + 'px';
    textField.style.height = cell.clientHeight - 2 + 'px';
    textField.innerText = content;
    cell.innerHTML = null;
    cell.appendChild(textField);
}

export const getUserInput = (setNewText) => {
    let formMap = new Map();
    setNewText(formMap, "name");
    setNewText(formMap, "ingredients");
    setNewText(formMap, "instructions");
    return formMap;
}

export function toggleButtons(visibleBtn, hiddenBtn) {
    visibleBtn.style.display = "none";
    hiddenBtn.style.display = "block";
}