import { Request, Response } from "express";
import Message from "../models/message.model";
import Ticket from "../models/ticket.model";

/**
 * Send Message
 */
export const sendMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketId, content } = req.body;

    if (!ticketId || !content) {
      return res.status(400).json({
        success: false,
        message: "ticketId and content are required",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const message = await Message.create({
      ticketId,
      senderId: (req as any).user.userId,
      content,
      type: "text",
    });

    const populatedMessage =
      await Message.findById(message._id)
        .populate("senderId", "name email role");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/**
 * Get Chat History
 */
export const getMessagesByTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketId } = req.params;

    const messages = await Message.find({
      ticketId,
    })
      .populate("senderId", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};