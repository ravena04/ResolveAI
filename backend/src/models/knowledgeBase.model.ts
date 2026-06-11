import mongoose, { Document, Schema } from "mongoose";

export interface IKnowledgeBase extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  sourceTicketId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    sourceTicketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeBase = mongoose.model<IKnowledgeBase>(
  "KnowledgeBase",
  knowledgeBaseSchema
);

export default KnowledgeBase;