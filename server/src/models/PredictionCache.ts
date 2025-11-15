import mongoose, { Schema, Document } from 'mongoose';

export interface IPredictionCache extends Document {
  location: string; // Format: "lat,lon"
  type: string; // temperature, rainfall, etc.
  data: any; // JSON data
  expiresAt: Date;
  createdAt: Date;
}

const predictionCacheSchema = new Schema<IPredictionCache>(
  {
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Unique compound index
predictionCacheSchema.index({ location: 1, type: 1 }, { unique: true });

// TTL index - automatically delete expired documents
predictionCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PredictionCache = mongoose.model<IPredictionCache>('PredictionCache', predictionCacheSchema);
