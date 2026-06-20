import { Request, Response } from "express";
import Ticket from "../models/ticket.model";
import Notification from "../models/notification.model";
import { getIO } from "../socket";
import {categorizeTicket,getAISuggestion,getRAGSolution} from "../services/ai.service";

/**
 * Create Ticket
 * Employee creates a new ticket
 */
export const createTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      screenshotUrl,
    } = req.body;

    // AI Categorization
    const aiCategory =
      await categorizeTicket(
        description
      );

    // AI Suggestion
    const aiSuggestion =
      await getAISuggestion(
        description
      );

    // RAG Solution
    const ragResult =
      await getRAGSolution(
        description
      );

    const ticket =
      await Ticket.create({
        title,
        description,

        category:
          aiCategory.category,

        priority:
          aiCategory.priority,

        aiSuggestion:
          aiSuggestion.suggestion,

        aiConfidence:
          aiSuggestion.confidence,

        ragAnswer:
          ragResult.answer,

        ragSources:
          ragResult.context,

        status: "ai_suggested",

        screenshotUrl,

        raisedBy:
          (req as any).user.userId,
      });

    res.status(201).json({
      success: true,
      message:
        "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error(
      "Create Ticket Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create ticket",
    });
  }
};

/**
 * Get Tickets
 * Employee -> own tickets
 * Agent -> escalated tickets
 * Admin -> all tickets
 */
export const getTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    let tickets;

    if (user.role === "employee") {
      tickets = await Ticket.find({
        raisedBy: user.userId,
      })
        .populate("raisedBy", "name email")
        .sort({ createdAt: -1 });
    } else if (user.role === "agent") {
      tickets = await Ticket.find({
        status: "escalated",
      })
        .populate("raisedBy", "name email")
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find()
        .populate("raisedBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Get Tickets Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

/**
 * Get Single Ticket
 */
export const getTicketById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("raisedBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Get Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
    });
  }
};

/**
 * Escalate Ticket
 * Employee escalates when AI solution fails
 */
export const escalateTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.status = "escalated";

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket escalated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Escalate Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to escalate ticket",
    });
  }
};

/**
 * Resolve Ticket
 * Agent resolves assigned/escalated ticket
 */
export const resolveTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const resolutionNote = req.body?.resolutionNote;

    if (!resolutionNote) {
      return res.status(400).json({
        success: false,
        message: "Resolution note is required",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.status = "resolved";
    ticket.resolutionNote = resolutionNote;
    ticket.resolvedBy = "Agent";
    ticket.resolvedAt = new Date();

    await ticket.save();

    await Notification.create({
      userId: ticket.raisedBy,
      ticketId: ticket._id,
      type: "ticket_resolved",
      message: `Your ticket "${ticket.title}" has been resolved.`,
    });
 
getIO()
  .to(ticket.raisedBy.toString())
  .emit("notification", {
    message: `Your ticket "${ticket.title}" has been resolved.`,
    ticketId: ticket._id,
    type: "ticket_resolved",
  });

    res.status(200).json({
      success: true,
      message: "Ticket resolved successfully",
      ticket,
    });
  } catch (error) {
    console.error("Resolve Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to resolve ticket",
    });
  }
};

/**
 * Assign Ticket
 * Admin assigns ticket to an agent
 */
export const assignTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.assignedTo = agentId;
    ticket.status = "in_progress";

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      ticket,
    });
  } catch (error) {
    console.error("Assign Ticket Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign ticket",
    });
  }
};