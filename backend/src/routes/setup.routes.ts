import express from 'express';
import {
  checkSystemInitialization,
  initializeSystem,
  getCooperativeType,
  updateCooperativeType,
} from '../controllers/setup.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/roles';

const router = express.Router();

// Public routes
router.get('/check-initialization', checkSystemInitialization);
router.post('/initialize', initializeSystem);

// Protected routes
router.get('/cooperative-type/:cooperativeId?', authenticate, getCooperativeType);
router.put('/cooperative-type/:cooperativeId', authenticate, isAdmin, updateCooperativeType);

export default router;
