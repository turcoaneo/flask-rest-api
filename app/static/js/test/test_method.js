import {deepEqual} from "../utils.js";
import {given_Desc_thenRunMethod} from "./test_utils.js";

(function () {
    'use strict';

    window.onload = () => {
        given_Desc_thenRunMethod('should not fail', function () {
            const result = assertExample(1 === 1);
            document.getElementById("id-test-context").innerText = result.toString();
        });
        given_Desc_thenRunMethod('deep equal scalar', function () {
            const result = deepEqual(124, 124);
            document.getElementById("id-test-deep-equal-scalar").innerText = result.toString();
        });
        given_Desc_thenRunMethod('deep not equal scalar', function () {
            const result = !deepEqual(123, 124);
            document.getElementById("id-test-deep-not-equal-scalar").innerText = result.toString();
        });
        given_Desc_thenRunMethod('deep equal object', function () {
            const expected = JSON.stringify({
                "name": "test",
                "ingredients": ["water", "soda"],
                "instructions": "drink"
            });
            const actual = JSON.stringify({
                "name": "test",
                "ingredients": ["water", "soda"],
                "instructions": "drink"
            });
            const result = deepEqual(expected, actual);
            document.getElementById("id-test-deep-equal-object").innerText = result.toString();
        });
        given_Desc_thenRunMethod('deep not equal object', function () {
            const expected = JSON.stringify({
                "name": "test",
                "ingredients": ["water", "soda"],
                "instructions": "drink"
            });
            const actual = JSON.stringify({
                "ingredients": ["water", "soda"],
                "name": "test",
                "instructions": "drink"
            });
            const result = !deepEqual(expected, actual);
            document.getElementById("id-test-deep-not-equal-object").innerText = result.toString();
        });
    }

    function assertExample(isTrue) {
        if (!isTrue) {
            throw new Error();
        }
        return true;
    }
})();