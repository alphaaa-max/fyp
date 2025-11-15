import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherCache extends Document {
  location: string; // Format: "lat,lon"
  data: any; // JSON data
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const weatherCacheSchema = new Schema<IWeatherCache>(
  {
    location: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
    timestamps: true,
  }
);

// TTL index - automatically delete expired documents
weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const WeatherCache = mongoose.model<IWeatherCache>('WeatherCache', weatherCacheSchema);
