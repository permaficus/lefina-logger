import express from 'express'
import { log } from '../controller/logger.js';

export const router = new express.Router();

router.post('/logging', log.create)
