import express, { Request, Response, NextFunction } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', (req, res) => {
  register(req, res);
});

router.post('/login', (req, res) => {
  login(req, res);
});

router.post('/logout', (req, res) => {
  logout(req, res);
});

// Protected routes
router.get('/me',
  (req, res, next) => {
    authenticate(req, res, next);
  },
  (req, res) => {
    getCurrentUser(req, res);
  }
);

export default router;
