import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'severe' | 'warning' | 'advisory' | 'info';
  title: string;
  message: string;
  location: string;
  severity: number;
  isRead: boolean;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['severe', 'warning', 'advisory', 'info'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    severity: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
alertSchema.index({ userId: 1, isRead: 1 });
alertSchema.index({ location: 1, isActive: 1 });

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
