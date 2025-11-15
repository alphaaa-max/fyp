import mongoose, { Schema, Document } from 'mongoose';

export interface IForecastHistory extends Document {
  location: string; // Format: "lat,lon"
  data: any; // JSON data
  predictedFor: Date;
  createdAt: Date;
}

const forecastHistorySchema = new Schema<IForecastHistory>(
  {
    location: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    predictedFor: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient queries
forecastHistorySchema.index({ location: 1, predictedFor: 1 });

export const ForecastHistory = mongoose.model<IForecastHistory>('ForecastHistory', forecastHistorySchema);
