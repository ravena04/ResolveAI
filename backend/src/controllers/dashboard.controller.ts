import { Request, Response } from "express";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";

export const getEmployeeDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId;

    const totalTickets = await Ticket.countDocuments({
      raisedBy: userId,
    });

    const openTickets = await Ticket.countDocuments({
      raisedBy: userId,
      status: "open",
    });

    const resolvedTickets = await Ticket.countDocuments({
      raisedBy: userId,
      status: "resolved",
    });

    const escalatedTickets = await Ticket.countDocuments({
      raisedBy: userId,
      status: "escalated",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        resolvedTickets,
        escalatedTickets,
      },
    });
  } catch (error) {
    console.error("Employee Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export const getAgentDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId;

    const assignedTickets = await Ticket.countDocuments({
      assignedTo: userId,
    });

    const resolvedTickets = await Ticket.countDocuments({
      assignedTo: userId,
      status: "resolved",
    });

    const pendingTickets = await Ticket.countDocuments({
      assignedTo: userId,
      status: {
        $in: ["escalated", "in_progress"],
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        assignedTickets,
        resolvedTickets,
        pendingTickets,
      },
    });
  } catch (error) {
    console.error("Agent Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export const getAdminDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalEmployees = await User.countDocuments({
      role: "employee",
    });

    const totalAgents = await User.countDocuments({
      role: "agent",
    });

    const totalTickets = await Ticket.countDocuments();

    const resolvedTickets = await Ticket.countDocuments({
      status: "resolved",
    });

    const openTickets = await Ticket.countDocuments({
      status: {
        $in: ["open", "escalated", "in_progress"],
      },
    });

    const resolutionRate =
      totalTickets > 0
        ? Number(
            (
              (resolvedTickets / totalTickets) *
              100
            ).toFixed(2)
          )
        : 0;

    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEmployees,
        totalAgents,
        totalTickets,
        resolvedTickets,
        openTickets,
        resolutionRate,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};