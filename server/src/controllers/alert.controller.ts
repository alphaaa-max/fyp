import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { alertService } from '../services/alert.service';

export const getAlerts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { unreadOnly } = req.query;
    const showUnreadOnly = unreadOnly === 'true';

    const alerts = await alertService.getUserAlerts(req.user.id, showUnreadOnly);

    res.json({
      status: 'success',
      data: alerts,
    });
  }
);

export const markAsRead = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { id } = req.params;

    try {
      const alert = await alertService.markAlertAsRead(id, req.user.id);

      res.json({
        status: 'success',
        data: alert,
      });
    } catch (error) {
      throw new AppError(404, 'Alert not found');
    }
  }
);
