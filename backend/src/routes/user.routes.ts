import express, { Request, Response, NextFunction } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use((req, res, next) => {
  authenticate(req, res, next);
});

// Get all users - Admin, Manager, Board Member
router.get(
  '/',
  (req, res, next) => {
    authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER'])(req, res, next);
  },
  (req, res) => {
    getAllUsers(req, res);
  }
);

// Get user by ID - Admin, Manager, Board Member, or the user themselves
router.get('/:id', (req, res) => {
  getUserById(req, res);
});

// Create user - Admin only
router.post(
  '/',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    createUser(req, res);
  }
);

// Update user - Admin, or the user themselves
router.put('/:id', (req, res) => {
  updateUser(req, res);
});

// Delete user - Admin only
router.delete(
  '/:id',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    deleteUser(req, res);
  }
);

export default router;
