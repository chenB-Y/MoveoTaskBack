import express from 'express';
const router = express.Router();
import songController from '../controllers/song_controller';

router.post('/instruments', songController.getSongData);

router.post('/singers', songController.getSongWords);

export default router;
