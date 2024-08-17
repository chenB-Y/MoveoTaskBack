import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin_controller';

router.post('/desireSong', adminController.searchSongs);

export default router;
