import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import loanRoutes from './loan.routes';
import depositRoutes from './deposit.routes';
import collateralRoutes from './collateral.routes';
import setupRoutes from './setup.routes'; // Add this line
import complianceRoutes from './compliance.routes';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/loans', loanRoutes);
router.use('/deposits', depositRoutes);
router.use('/collateral', collateralRoutes);
router.use('/setup', setupRoutes); // Add this line
router.use('/compliance', complianceRoutes);

export default router;
