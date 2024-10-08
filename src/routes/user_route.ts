import express from 'express';
const router = express.Router();
import AuthController from '../controllers/user_controller';

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

export default router;
