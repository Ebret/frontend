import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getWhiteLabelConfig, createOrUpdateCooperative } from '../utils/white-label';

const prisma = new PrismaClient();

// Get all cooperatives
export const getAllCooperatives = async (req: Request, res: Response) => {
  try {
    const cooperatives = await prisma.cooperative.findMany();

    return res.status(200).json({
      status: 'success',
      data: {
        cooperatives,
      },
    });
  } catch (error) {
    console.error('Get all cooperatives error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching cooperatives',
    });
  }
};

// Get cooperative by ID
export const getCooperativeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cooperativeId = parseInt(id, 10);

    const cooperative = await prisma.cooperative.findUnique({
      where: { id: cooperativeId },
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
        cooperative,
      },
    });
  } catch (error) {
    console.error('Get cooperative by ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the cooperative',
    });
  }
};

// Get cooperative by code
export const getCooperativeByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const cooperative = await prisma.cooperative.findUnique({
      where: { code },
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
        cooperative,
      },
    });
  } catch (error) {
    console.error('Get cooperative by code error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the cooperative',
    });
  }
};

// Create a new cooperative
export const createCooperative = async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      logo,
      primaryColor,
      secondaryColor,
      address,
      phoneNumber,
      email,
      website,
    } = req.body;

    // Check if cooperative already exists
    const existingCooperative = await prisma.cooperative.findUnique({
      where: { code },
    });

    if (existingCooperative) {
      return res.status(400).json({
        status: 'error',
        message: 'Cooperative with this code already exists',
      });
    }

    // Create cooperative
    const cooperative = await createOrUpdateCooperative({
      name,
      code,
      logo,
      primaryColor,
      secondaryColor,
      address,
      phoneNumber,
      email,
      website,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Cooperative created successfully',
      data: {
        cooperative,
      },
    });
  } catch (error) {
    console.error('Create cooperative error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the cooperative',
    });
  }
};

// Update cooperative
export const updateCooperative = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cooperativeId = parseInt(id, 10);
    const {
      name,
      logo,
      primaryColor,
      secondaryColor,
      address,
      phoneNumber,
      email,
      website,
    } = req.body;

    // Check if cooperative exists
    const existingCooperative = await prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    if (!existingCooperative) {
      return res.status(404).json({
        status: 'error',
        message: 'Cooperative not found',
      });
    }

    // Update cooperative
    const updatedCooperative = await prisma.cooperative.update({
      where: { id: cooperativeId },
      data: {
        name,
        logo,
        primaryColor,
        secondaryColor,
        address,
        phoneNumber,
        email,
        website,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cooperative updated successfully',
      data: {
        cooperative: updatedCooperative,
      },
    });
  } catch (error) {
    console.error('Update cooperative error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the cooperative',
    });
  }
};

// Delete cooperative
export const deleteCooperative = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cooperativeId = parseInt(id, 10);

    // Check if cooperative exists
    const existingCooperative = await prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    if (!existingCooperative) {
      return res.status(404).json({
        status: 'error',
        message: 'Cooperative not found',
      });
    }

    // Delete cooperative
    await prisma.cooperative.delete({
      where: { id: cooperativeId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cooperative deleted successfully',
    });
  } catch (error) {
    console.error('Delete cooperative error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the cooperative',
    });
  }
};

// Get white-label configuration
export const getWhiteLabel = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    
    const config = await getWhiteLabelConfig(code as string);

    return res.status(200).json({
      status: 'success',
      data: {
        config,
      },
    });
  } catch (error) {
    console.error('Get white-label config error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching white-label configuration',
    });
  }
};
