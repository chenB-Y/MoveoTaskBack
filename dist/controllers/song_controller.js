"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = require('cheerio');
const getSongData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const linkToSong = req.body.desireSong;
    try {
        const response = yield axios_1.default.get(linkToSong);
        const html = response.data;
        const $ = cheerio.load(html);
        // Extract the content within the element with ID "songContentTPL"
        const songContent = $('#songContentTPL').html();
        if (songContent) {
            res.json({ songContent });
        }
        else {
            res.status(404).json({ error: 'Content not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching the page' });
    }
});
const getSongWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const linkToSong = req.body.desireSong;
    try {
        const response = yield axios_1.default.get(linkToSong);
        const html = response.data;
        const $ = cheerio.load(html);
        // Remove all <td> elements with the class "chords_en"
        $('td.chords_en').remove();
        $('td.chords').remove();
        $('td.tabs').remove();
        $('span.titLine').remove();
        // Extract the content within the element with ID "songContentTPL"
        const songContent = $('#songContentTPL').html();
        if (songContent) {
            res.json({ songContent });
        }
        else {
            res.status(404).json({ error: 'Content not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching the page' });
    }
});
exports.default = {
    getSongData,
    getSongWords,
};
//# sourceMappingURL=song_controller.js.map