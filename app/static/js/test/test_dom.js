import {buildAppTable} from "../utils.js";
import {getEnvAndInitApp} from "../app_script.js";
import {it, monkeyPatchingApiCallStub, monkeyPatchingApiCallStubError} from "./test_utils.js";

export const test_dom = () => {
    'use strict';

    const mock_data = {
        "id": "1",
        "name": "test",
        "ingredients": ["water", "soda"],
        "instructions": "drink"
    };
    const doNothing = () => {
    }

    it('should find DOM table and row elements', function () {
        const elements = document.querySelectorAll('[data-test-id=test-div-table]');

        let result = elements[0] != null;
        buildAppTable(mock_data, "../../static/icons/");
        const checkBtn = document.getElementById('Add-1');
        result = result && checkBtn != null;
        document.getElementById("id-test-table-items").innerText = result.toString();
    });

    it('should mock API call and create DOM', function () {
        getEnvAndInitApp(monkeyPatchingApiCallStub(mock_data), monkeyPatchingApiCallStubError, doNothing).then(() => {
            assertAndSetTestId("id-test-load-app", "Recipe form");
        });
    });

    it('should mock API call and async create DOM', function () {
        getEnvAndInitApp(monkeyPatchingApiCallStub(mock_data), monkeyPatchingApiCallStubError, doNothing);
        assertAndSetTestId("id-test-load-async-dom", "Loading ENV... Please wait!");
    });

    it('should fail to create DOM', function () {
        getEnvAndInitApp(monkeyPatchingApiCallStub(null), monkeyPatchingApiCallStubError, doNothing);
        assertAndSetTestId("id-test-fail-dom", "Loading ENV... Please wait!");
    });

    function assertAndSetTestId(elementId, innerText) {
        const divTitle = document.getElementById("app-title");
        const result = divTitle.innerText === innerText;
        document.getElementById(elementId).innerText = result.toString();
    }
}