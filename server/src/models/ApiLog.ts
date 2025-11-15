import mongoose, { Schema, Document } from 'mongoose';

export interface IApiLog extends Document {
  endpoint: string;
  method: string;
  userId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  statusCode: number;
  responseTime: number; // in milliseconds
  createdAt: Date;
}

const apiLogSchema = new Schema<IApiLog>(
  {
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for time-based queries
apiLogSchema.index({ createdAt: 1 });

export const ApiLog = mongoose.model<IApiLog>('ApiLog', apiLogSchema);
