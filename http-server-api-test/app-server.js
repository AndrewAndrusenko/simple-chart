"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const res_1 = require("../http-server-api-test/res");
const cors_1 = __importDefault(require("cors"));
const PORT = 3005;
const colors = ['#4d9058', '#4d7990', '#ce2514', '#9614ce'];
const pointTypes = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'];
const appServer = (0, express_1.default)();
appServer.use((0, cors_1.default)());
appServer.use(express_1.default.json());
let testData = JSON.parse(JSON.stringify(res_1.data));
appServer.get('/', (req, res) => {
    console.log('Your request is received');
    let varName1 = `Data${Math.floor(Math.random() * 9)}`;
    let varName2 = `Data_Probability${Math.floor(Math.random() * 9)}`;
    testData.data = res_1.data.data.map(el => {
        return {
            [varName1]: el.var1 + Math.random(),
            [varName2]: el.var2 + Math.random()
        };
    });
    testData.presets.color = colors[Math.floor(Math.random() * 3)];
    testData.presets.symbol = pointTypes[Math.floor(Math.random() * 8)];
    res.send(testData);
});
appServer.listen(PORT, 'localhost', () => console.log(`Test Server is running on port ${PORT}`));
