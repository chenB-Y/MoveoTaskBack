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
// Use require if import is causing issues
const cheerio = require('cheerio');
const searchSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songName = req.body.songName;
    console.log('Searching for songs with name:', songName);
    const url = `https://www.tab4u.com/resultsSimple?tab=songs&q=${songName}`;
    console.log('url:', url);
    try {
        const response = yield axios_1.default.get(url);
        const html = response.data;
        if (!html) {
            throw new Error('No HTML content received from the request.');
        }
        const $ = cheerio.load(html);
        // Initialize an array to store the results
        const songs = [];
        // Iterate over each element with class sNameI19
        $('.sNameI19').each((i, el) => {
            const songTitle = $(el).text().trim();
            const artist = $(el).siblings('.aNameI19').text().trim(); // Find the sibling element with class aNameI19
            const href = $(el).closest('a').attr('href');
            // Push each song as an object into the array
            songs.push({
                songTitle: songTitle,
                artist: artist,
                href: href ? `https://www.tab4u.com/${href}` : '', // Prepend base URL if needed
            });
        });
        console.log(songs);
        return res.status(200).send(songs);
    }
    catch (error) {
        console.error('Error fetching songs from this songName:', error.message);
        return res.status(500).send('An error occurred while fetching songs.');
    }
});
exports.default = {
    searchSongs,
};
//# sourceMappingURL=admin_controller.js.map