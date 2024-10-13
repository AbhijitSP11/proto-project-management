import express from 'express';
import { groqResponse } from '../controllers/groqController';

const router = express.Router();

router.post('/chat', groqResponse);

export default router;