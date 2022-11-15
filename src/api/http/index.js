"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
exports["default"] = axios_1["default"].create({
    baseURL: 'https://core.chainoflegends.com/api/v1',
    headers: {
        'content-type': 'application/json'
    }
});
