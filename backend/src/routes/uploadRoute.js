import express from 'express';
import { upload, uploadImages } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.array('files', 2), uploadImages);

export default router;
