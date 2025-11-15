import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { UpdateUserDto, LocationDto } from '../types/user.types';
import { logger } from '../utils/logger';

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { name, email } = req.body as UpdateUserDto;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== req.user.id) {
        throw new AppError(400, 'Email already in use');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User updated profile: ${updatedUser.email}`);

    res.json({
      status: 'success',
      data: updatedUser,
    });
  }
);

export const getLocations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const locations = await prisma.location.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({
      status: 'success',
      data: locations,
    });
  }
);

export const addLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { name, latitude, longitude, isPrimary } = req.body as LocationDto;

    // If setting as primary, unset other primary locations
    if (isPrimary) {
      await prisma.location.updateMany({
        where: { userId: req.user.id, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const location = await prisma.location.create({
      data: {
        userId: req.user.id,
        name,
        latitude,
        longitude,
        isPrimary: isPrimary || false,
      },
    });

    logger.info(`User ${req.user.email} added location: ${name}`);

    res.status(201).json({
      status: 'success',
      data: location,
    });
  }
);

export const deleteLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { id } = req.params;

    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new AppError(404, 'Location not found');
    }

    if (location.userId !== req.user.id) {
      throw new AppError(403, 'Not authorized to delete this location');
    }

    await prisma.location.delete({
      where: { id },
    });

    logger.info(`User ${req.user.email} deleted location: ${location.name}`);

    res.json({
      status: 'success',
      message: 'Location deleted successfully',
    });
  }
);

export const updateLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const { name, isPrimary } = req.body;

    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new AppError(404, 'Location not found');
    }

    if (location.userId !== req.user.id) {
      throw new AppError(403, 'Not authorized to update this location');
    }

    // If setting as primary, unset other primary locations
    if (isPrimary) {
      await prisma.location.updateMany({
        where: { userId: req.user.id, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(isPrimary !== undefined && { isPrimary }),
      },
    });

    res.json({
      status: 'success',
      data: updatedLocation,
    });
  }
);
