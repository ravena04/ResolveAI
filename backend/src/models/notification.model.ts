import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  ticketId?: mongoose.Types.ObjectId;
  message: string;
  type: string;
  isRead: boolean;
}

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);