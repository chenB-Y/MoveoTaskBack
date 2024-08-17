"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const song_controller_1 = __importDefault(require("../controllers/song_controller"));
router.post('/instruments', song_controller_1.default.getSongData);
router.post('/singers', song_controller_1.default.getSongWords);
exports.default = router;
//# sourceMappingURL=song_route.js.map