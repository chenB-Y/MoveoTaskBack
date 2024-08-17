"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_controller_1 = __importDefault(require("../controllers/admin_controller"));
router.post('/desireSong', admin_controller_1.default.searchSongs);
exports.default = router;
//# sourceMappingURL=admin_route.js.map