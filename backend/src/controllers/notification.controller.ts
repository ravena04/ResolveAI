import { Request, Response } from "express";
import Notification from "../models/notification.model";

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const notifications = await Notification.find({
      userId: (req as any).user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};