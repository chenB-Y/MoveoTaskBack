import axios from 'axios';
import { Request, Response } from 'express';
const cheerio = require('cheerio');

const getSongData = async (req: Request, res: Response) => {
  const linkToSong = req.body.desireSong;
  try {
    const response = await axios.get(linkToSong);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract the content within the element with ID "songContentTPL"
    const songContent = $('#songContentTPL').html();

    if (songContent) {
      res.json({ songContent });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the page' });
  }
};

const getSongWords = async (req: Request, res: Response) => {
  const linkToSong = req.body.desireSong;
  try {
    const response = await axios.get(linkToSong);
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
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the page' });
  }
};

export default {
  getSongData,
  getSongWords,
};
