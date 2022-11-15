var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var TOKEN = localStorage.getItem('user.token');
var BASE_URL = 'https://core.chainoflegends.com/api/v1';
var ORDER_ENDPOINT = '/land/2/orders';
var PLAYER_ENDPOINT = '/player';
var PLAYER_LAND_ENDPOINT = '/playerland';
var BUY_ORDER_ENDPOINT = function (id) { return '/order/' + id + '/buy'; };
var SELL_ORDER_ENDPOINT = function (id) { return '/playerland/' + id + '/place-order'; };
var MAX_COMMON_PRICE = 34;
var http = function (_a) {
    var endpoint = _a.endpoint, _b = _a.config, config = _b === void 0 ? {} : _b;
    return __awaiter(_this, void 0, void 0, function () {
        var defaultConfig, res, jsoned;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    defaultConfig = {
                        headers: {
                            authorization: 'Bearer ' + TOKEN,
                            'content-type': 'application/json'
                        }
                    };
                    return [4 /*yield*/, fetch(BASE_URL + endpoint, __assign(__assign({}, defaultConfig), config))];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    jsoned = _c.sent();
                    return [2 /*return*/, jsoned];
            }
        });
    });
};
var sortBy = function (_a) {
    var array = _a.array, param = _a.param;
    return __spreadArray([], array, true).sort(function (a, b) { return Number(a[param]) - Number(b[param]); });
};
var getOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders, sortedOrders, filtered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, http({ endpoint: ORDER_ENDPOINT })];
            case 1:
                orders = _a.sent();
                sortedOrders = sortBy({ array: orders, param: 'ClegPrice' });
                filtered = sortedOrders.filter(function (_a) {
                    var ClegPrice = _a.ClegPrice;
                    return ClegPrice <= MAX_COMMON_PRICE;
                });
                return [2 /*return*/, filtered];
        }
    });
}); };
var getPlayerInfo = function () { return __awaiter(_this, void 0, void 0, function () {
    var playerInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, http({ endpoint: PLAYER_ENDPOINT })];
            case 1:
                playerInfo = _a.sent();
                return [2 /*return*/, playerInfo];
        }
    });
}); };
var getBuylableOrders = function (balance) { return __awaiter(_this, void 0, void 0, function () {
    var allOrders, amountToBuy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOrders()];
            case 1:
                allOrders = _a.sent();
                amountToBuy = Math.floor(balance / MAX_COMMON_PRICE);
                return [2 /*return*/, allOrders.slice(0, amountToBuy)];
        }
    });
}); };
var buyOrders = function (orders) { return __awaiter(_this, void 0, void 0, function () {
    var _i, orders_1, ID, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, orders_1 = orders;
                _a.label = 1;
            case 1:
                if (!(_i < orders_1.length)) return [3 /*break*/, 6];
                ID = orders_1[_i].ID;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, http({ endpoint: BUY_ORDER_ENDPOINT(ID) })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getNotSellingOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var DESERT, orders, notSellingorders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                DESERT = 'Desert';
                return [4 /*yield*/, http({ endpoint: PLAYER_LAND_ENDPOINT })];
            case 1:
                orders = _a.sent();
                notSellingorders = orders.filter(function (_a) {
                    var clegPrice = _a.clegPrice, name = _a.name;
                    return clegPrice === 0 && name !== DESERT;
                });
                console.log('not sell orders', notSellingorders);
                return [2 /*return*/, notSellingorders];
        }
    });
}); };
var sellOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var SELL_PRICE, sellOrderConfig, orders, _i, orders_2, id, res, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                SELL_PRICE = (36.4 + Math.random() * 0.1).toFixed(2);
                sellOrderConfig = {
                    method: 'POST',
                    body: JSON.stringify({ clegPrice: SELL_PRICE })
                };
                return [4 /*yield*/, getNotSellingOrders()];
            case 1:
                orders = _a.sent();
                _i = 0, orders_2 = orders;
                _a.label = 2;
            case 2:
                if (!(_i < orders_2.length)) return [3 /*break*/, 7];
                id = orders_2[_i].id;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, http({
                        endpoint: SELL_ORDER_ENDPOINT(id),
                        config: sellOrderConfig
                    })];
            case 4:
                res = _a.sent();
                console.log('set to sell', res);
                return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.log(e_2);
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
var app = function () { return __awaiter(_this, void 0, void 0, function () {
    var totalCleg, buylableOrders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPlayerInfo()];
            case 1:
                totalCleg = (_a.sent()).totalCleg;
                return [4 /*yield*/, getBuylableOrders(totalCleg)];
            case 2:
                buylableOrders = _a.sent();
                if (!buylableOrders.length)
                    return [2 /*return*/];
                return [4 /*yield*/, buyOrders(buylableOrders)];
            case 3:
                _a.sent();
                return [4 /*yield*/, sellOrders()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// setInterval(() => {
//   app()
// }, Math.random() * 10000)
console.log('From typescript');
