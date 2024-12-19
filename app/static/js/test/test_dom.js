import {buildAppTable} from "../utils.js";
import {given_Desc_thenRunMethod} from "./test_utils.js";

(function () {
    'use strict';

    window.onload = () => {
        given_Desc_thenRunMethod('should find table', function () {
            const elements = document.querySelectorAll('[data-test-id=test-div-table]');
            const mock_data = {
                "id": "1",
                "name": "test",
                "ingredients": ["water", "soda"],
                "instructions": "drink"
            };
            let result = elements[0] != null;
            buildAppTable(mock_data, "../../static/icons/");
            const checkBtn = document.getElementById('Add-1');
            result = result && checkBtn != null;
            document.getElementById("id-test-table-items").innerText = result.toString();
        });
    }
})();