import axios from 'axios';
import { Request, Response } from 'express';

// Use require if import is causing issues
const cheerio = require('cheerio');

const searchSongs = async (req: Request, res: Response) => {
  const songName = req.body.songName;
  console.log('Searching for songs with name:', songName);
  const url = `https://www.tab4u.com/resultsSimple?tab=songs&q=${songName}`;
  console.log('url:', url);

  try {
    const response = await axios.get(url);
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

      // Find the span element with the class ruArtPhoto relZ within the same context
      const imageSpan = $(el).closest('a').find('span.ruArtPhoto.relZ');
      const backgroundImage = imageSpan.css('background-image');
      const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      const imageUrl = urlMatch ? urlMatch[1] : '';

      // Push each song as an object into the array
      songs.push({
        songTitle: songTitle,
        artist: artist,
        href: href ? `https://www.tab4u.com/${href}` : '', // Prepend base URL if needed
        imageUrl: `https://www.tab4u.com${imageUrl}`, // Add the image URL to the result
      });
    });

    console.log(songs);

    return res.status(200).send(songs);
  } catch (error) {
    console.error('Error fetching songs from this songName:', error.message);
    return res.status(500).send('An error occurred while fetching songs.');
  }
};

export default {
  searchSongs,
};
