import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { auditLog } from '../utils/audit';

const prisma = new PrismaClient();

/**
 * Check if the system has been initialized
 */
export const checkSystemInitialization = async (req: Request, res: Response) => {
  try {
    const systemConfig = await prisma.systemConfig.findUnique({
      where: { key: 'SYSTEM_INITIALIZED' },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        initialized: systemConfig?.value === 'true',
      },
    });
  } catch (error) {
    logger.error('Error checking system initialization:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to check system initialization',
    });
  }
};

/**
 * Initialize the system with cooperative type
 */
export const initializeSystem = async (req: Request, res: Response) => {
  try {
    const { cooperativeType, cooperativeName, adminEmail, adminPassword } = req.body;

    // Validate input
    if (!cooperativeType || !cooperativeName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if system is already initialized
    const systemInitialized = await prisma.systemConfig.findUnique({
      where: { key: 'SYSTEM_INITIALIZED' },
    });

    if (systemInitialized?.value === 'true') {
      return res.status(400).json({
        status: 'error',
        message: 'System is already initialized',
      });
    }

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Create or update cooperative
      const cooperative = await tx.cooperative.create({
        data: {
          name: cooperativeName,
          code: cooperativeName.toLowerCase().replace(/\s+/g, '-'),
          type: cooperativeType,
        },
      });

      // Create admin user
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: adminPassword, // Note: In a real app, this should be hashed
          role: 'ADMIN',
          status: 'ACTIVE',
          cooperativeId: cooperative.id,
        },
      });

      // Update system config
      await tx.systemConfig.update({
        where: { key: 'SYSTEM_INITIALIZED' },
        data: { value: 'true' },
      });

      await tx.systemConfig.update({
        where: { key: 'DEFAULT_COOPERATIVE_TYPE' },
        data: { value: cooperativeType },
      });

      // Log the initialization
      await auditLog({
        action: 'SYSTEM_INITIALIZED',
        userId: adminUser.id,
        details: {
          cooperativeType,
          cooperativeName,
          adminEmail,
        },
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'System initialized successfully',
    });
  } catch (error) {
    logger.error('Error initializing system:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to initialize system',
    });
  }
};

/**
 * Get current cooperative type
 */
export const getCooperativeType = async (req: Request, res: Response) => {
  try {
    const cooperativeId = req.params.cooperativeId || 1; // Default to first cooperative if not specified

    const cooperative = await prisma.cooperative.findUnique({
      where: { id: Number(cooperativeId) },
      select: { type: true, name: true },
    });

    if (!cooperative) {
      return res.status(404).json({
        status: 'error',
        message: 'Cooperative not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        type: cooperative.type,
        name: cooperative.name,
      },
    });
  } catch (error) {
    logger.error('Error getting cooperative type:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get cooperative type',
    });
  }
};

/**
 * Update cooperative type (admin only)
 */
export const updateCooperativeType = async (req: Request, res: Response) => {
  try {
    const { cooperativeId } = req.params;
    const { cooperativeType } = req.body;
    const userId = req.user?.id; // Assuming user is attached to request by auth middleware

    // Validate input
    if (!cooperativeType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing cooperative type',
      });
    }

    // Update cooperative type
    const cooperative = await prisma.cooperative.update({
      where: { id: Number(cooperativeId) },
      data: { type: cooperativeType },
    });

    // Log the change
    await auditLog({
      action: 'COOPERATIVE_TYPE_UPDATED',
      userId,
      details: {
        cooperativeId,
        previousType: cooperative.type,
        newType: cooperativeType,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cooperative type updated successfully',
      data: {
        type: cooperativeType,
      },
    });
  } catch (error) {
    logger.error('Error updating cooperative type:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update cooperative type',
    });
  }
};
