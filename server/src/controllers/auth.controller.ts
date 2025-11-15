import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';
import { CreateUserDto, LoginDto, AuthResponse, UserResponse } from '../types/user.types';
import { logger } from '../utils/logger';

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body as CreateUserDto;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    logger.info(`New user registered: ${user.email}`);

    const response: AuthResponse = {
      token,
      user,
    };

    res.status(201).json({
      status: 'success',
      data: response,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginDto;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    logger.info(`User logged in: ${user.email}`);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response: AuthResponse = {
      token,
      user: userResponse,
    };

    res.json({
      status: 'success',
      data: response,
    });
  }
);

export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: user,
    });
  }
);
