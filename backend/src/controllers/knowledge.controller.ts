import { Request, Response } from "express";
import KnowledgeBase from "../models/knowledgeBase.model";
import Ticket from "../models/ticket.model";
import Notification from "../models/notification.model";
import { addToVectorDB } from "../services/rag.service";
/**
 * Create Knowledge Base Article
 * Admin Only
 */
export const createArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      sourceTicketId,
    } = req.body;

    const article =
      await KnowledgeBase.create({
        title,
        content,
        category,
        tags,
        sourceTicketId,
        uploadedBy:
          (req as any).user.userId,
      });

    await addToVectorDB(
      article._id.toString(),
      article.title,
      article.content
    );

    res.status(201).json({
      success: true,
      message:
        "Article created successfully",
      article,
    });
  } catch (error) {
    console.error(
      "Create Article Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create article",
    });
  }
};

/**
 * Get All Articles
 */
export const getArticles = async (
  req: Request,
  res: Response
) => {
  try {
    const articles = await KnowledgeBase.find()
      .populate("uploadedBy", "name email")
      .populate("sourceTicketId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Get Articles Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

/**
 * Get Single Article
 */
export const getArticleById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const article = await KnowledgeBase.findById(id)
      .populate("uploadedBy", "name email")
      .populate("sourceTicketId");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Get Article Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

/**
 * Update Article
 * Admin Only
 */
export const updateArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const article = await KnowledgeBase.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Update Article Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update article",
    });
  }
};

/**
 * Delete Article
 * Admin Only
 */
export const deleteArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const article = await KnowledgeBase.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete Article Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete article",
    });
  }
};
export const createArticleFromTicket =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { ticketId } =
        req.params;

      const ticket =
        await Ticket.findById(
          ticketId
        );

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message:
            "Ticket not found",
        });
      }

      if (
        ticket.status !==
        "resolved"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only resolved tickets can be added to Knowledge Base",
        });
      }

      if (
        ticket.isAddedToKnowledgeBase
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Ticket already added to Knowledge Base",
        });
      }

      const article =
        await KnowledgeBase.create({
          title: ticket.title,
          content:
            ticket.resolutionNote,
          category:
            ticket.category,
          tags: [
            ticket.category.toLowerCase(),
          ],
          sourceTicketId:
            ticket._id,
          uploadedBy:
            (req as any).user.userId,
        });

      await addToVectorDB(
        article._id.toString(),
        article.title,
        article.content
      );

      ticket.isAddedToKnowledgeBase =
        true;

      await ticket.save();

      await Notification.create({
        userId: ticket.raisedBy,
        ticketId: ticket._id,
        type: "ticket_resolved",
        message: `Your ticket "${ticket.title}" has been resolved.`,
      });

      res.status(201).json({
        success: true,
        message:
          "Knowledge Base article created from ticket",
        article,
      });
    } catch (error) {
      console.error(
        "Create KB From Ticket Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create article from ticket",
      });
    }
  };