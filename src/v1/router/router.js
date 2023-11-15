import express from 'express'
import { log } from '../controller/logger.js';

export const router = new express.Router();

router.get('/logs/:level', log.read)
