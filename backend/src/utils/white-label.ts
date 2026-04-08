import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Get white-label configuration
export const getWhiteLabelConfig = async (cooperativeCode?: string) => {
  try {
    // If cooperative code is provided, get specific cooperative
    if (cooperativeCode) {
      const cooperative = await prisma.cooperative.findUnique({
        where: { code: cooperativeCode },
      });

      if (cooperative) {
        return {
          name: cooperative.name,
          logo: cooperative.logo || process.env.COOPERATIVE_LOGO_URL,
          primaryColor: cooperative.primaryColor || process.env.COOPERATIVE_PRIMARY_COLOR,
          secondaryColor: cooperative.secondaryColor || process.env.COOPERATIVE_SECONDARY_COLOR,
          address: cooperative.address,
          phoneNumber: cooperative.phoneNumber,
          email: cooperative.email,
          website: cooperative.website,
        };
      }
    }

    // Return default configuration from environment variables
    return {
      name: process.env.COOPERATIVE_NAME || 'Credit Cooperative System',
      logo: process.env.COOPERATIVE_LOGO_URL || 'https://example.com/logo.png',
      primaryColor: process.env.COOPERATIVE_PRIMARY_COLOR || '#007bff',
      secondaryColor: process.env.COOPERATIVE_SECONDARY_COLOR || '#6c757d',
      address: null,
      phoneNumber: null,
      email: null,
      website: null,
    };
  } catch (error) {
    console.error('Error getting white-label config:', error);
    
    // Return default configuration if error occurs
    return {
      name: process.env.COOPERATIVE_NAME || 'Credit Cooperative System',
      logo: process.env.COOPERATIVE_LOGO_URL || 'https://example.com/logo.png',
      primaryColor: process.env.COOPERATIVE_PRIMARY_COLOR || '#007bff',
      secondaryColor: process.env.COOPERATIVE_SECONDARY_COLOR || '#6c757d',
      address: null,
      phoneNumber: null,
      email: null,
      website: null,
    };
  }
};

// Create or update cooperative
export const createOrUpdateCooperative = async (cooperativeData: {
  name: string;
  code: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}) => {
  try {
    const { code } = cooperativeData;

    // Check if cooperative exists
    const existingCooperative = await prisma.cooperative.findUnique({
      where: { code },
    });

    if (existingCooperative) {
      // Update existing cooperative
      return await prisma.cooperative.update({
        where: { code },
        data: cooperativeData,
      });
    } else {
      // Create new cooperative
      return await prisma.cooperative.create({
        data: cooperativeData,
      });
    }
  } catch (error) {
    console.error('Error creating/updating cooperative:', error);
    throw error;
  }
};
