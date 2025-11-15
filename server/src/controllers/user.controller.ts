import { Request, Response, NextFunction } from 'express';
import { User, Location } from '../models';
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
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.id !== req.user.id) {
        throw new AppError(400, 'Email already in use');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
      { new: true }
    ).select('-password');

    logger.info(`User updated profile: ${updatedUser?.email}`);

    res.json({
      status: 'success',
      data: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name || null,
        createdAt: updatedUser?.createdAt,
        updatedAt: updatedUser?.updatedAt,
      },
    });
  }
);

export const getLocations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const locations = await Location.find({ userId: req.user.id })
      .sort({ isPrimary: -1, createdAt: -1 });

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
      await Location.updateMany(
        { userId: req.user.id, isPrimary: true },
        { isPrimary: false }
      );
    }

    const location = await Location.create({
      userId: req.user.id,
      name,
      latitude,
      longitude,
      isPrimary: isPrimary || false,
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

    const location = await Location.findById(id);

    if (!location) {
      throw new AppError(404, 'Location not found');
    }

    if (location.userId.toString() !== req.user.id) {
      throw new AppError(403, 'Not authorized to delete this location');
    }

    await Location.findByIdAndDelete(id);

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

    const location = await Location.findById(id);

    if (!location) {
      throw new AppError(404, 'Location not found');
    }

    if (location.userId.toString() !== req.user.id) {
      throw new AppError(403, 'Not authorized to update this location');
    }

    // If setting as primary, unset other primary locations
    if (isPrimary) {
      await Location.updateMany(
        { userId: req.user.id, isPrimary: true },
        { isPrimary: false }
      );
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(isPrimary !== undefined && { isPrimary }),
      },
      { new: true }
    );

    res.json({
      status: 'success',
      data: updatedLocation,
    });
  }
);
