import express, { Request, Response, NextFunction } from 'express';
import {
  getAllCooperatives,
  getCooperativeById,
  getCooperativeByCode,
  createCooperative,
  updateCooperative,
  deleteCooperative,
  getWhiteLabel,
} from '../controllers/cooperative.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/white-label', (req, res) => {
  getWhiteLabel(req, res);
});

router.get('/code/:code', (req, res) => {
  getCooperativeByCode(req, res);
});

// Protected routes
router.use((req, res, next) => {
  authenticate(req, res, next);
});

// Admin only routes
router.get(
  '/',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    getAllCooperatives(req, res);
  }
);

router.get(
  '/:id',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    getCooperativeById(req, res);
  }
);

router.post(
  '/',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    createCooperative(req, res);
  }
);

router.put(
  '/:id',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    updateCooperative(req, res);
  }
);

router.delete(
  '/:id',
  (req, res, next) => {
    authorize(['ADMIN'])(req, res, next);
  },
  (req, res) => {
    deleteCooperative(req, res);
  }
);

export default router;
