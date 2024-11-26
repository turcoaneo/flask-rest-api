export const setCell = (cell, cellId) => {
    const content = cell.innerText;

    // console.log("Td: " + content);
    const textField = document.createElement("textarea");
    textField.setAttribute("id", "textarea-" + cellId);
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