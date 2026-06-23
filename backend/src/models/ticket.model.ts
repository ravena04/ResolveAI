import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  title: string;

  description: string;

  category:
    | "Network"
    | "Hardware"
    | "Software"
    | "Access"
    | "Other";

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  status:
    | "open"
    | "ai_suggested"
    | "escalated"
    | "in_progress"
    | "resolved"
    | "closed";

  raisedBy: mongoose.Types.ObjectId;

  assignedTo?: mongoose.Types.ObjectId;

  screenshotUrl?: string;

  aiSuggestion?: string;

  aiConfidence?: number;

  ragAnswer?: string;

  ragSources?: string[];

  similarTickets?: string[];

  similarityScores?: number[];
  autoResolved?: boolean;

  resolutionNote?: string;

  isAddedToKnowledgeBase: boolean;

  resolvedBy?: "AI" | "Agent";

  resolvedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Network",
        "Hardware",
        "Software",
        "Access",
        "Other",
      ],
      default: "Other",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "ai_suggested",
        "escalated",
        "in_progress",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isAddedToKnowledgeBase: {
      type: Boolean,
      default: false,
    },

    screenshotUrl: {
      type: String,
    },

    aiSuggestion: {
      type: String,
    },

    aiConfidence: {
      type: Number,
      default: 0,
    },

    ragAnswer: {
      type: String,
    },

    ragSources: [
      {
        type: String,
      },
    ],

    similarTickets: [
      {
        type: String,
      },
    ],

    similarityScores: [
      {
        type: Number,
      },
    ],
    autoResolved: {
  type: Boolean,
  default: false,
},

    resolutionNote: {
      type: String,
    },

    resolvedBy: {
      type: String,
      enum: ["AI", "Agent"],
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model<ITicket>(
  "Ticket",
  ticketSchema
);

export default Ticket;