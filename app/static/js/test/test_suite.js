import {test_dom} from "./test_dom.js";
import {test_method} from "./test_method.js"

(function () {
    'use strict';

    window.onload = () => {
        test_dom();
        test_method();
    }
})();