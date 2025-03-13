import mongoose from "mongoose";



const eventModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      type: String, // URL of the image
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["donation", "volunteer", "items"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    targetAmount: {
      type: Number,
      required: function () {
        return this.type === "donation"; // Required only for donation posts
      },
    },
    currentAmount: {
      type: Number,
      default: 0, // Tracks how much has been donated so far
    },
    targetVolunteers: {
      type: Number,
      required: function () {
        return this.type === "volunteer"; // Required only for volunteer posts
      },
    },
    volunteerHours: {
      type: Number,
      required: function () {
        return this.type === "volunteer"; // Required only for volunteer posts
      },
    },
    currentVolunteers: {
      type: Number,
      default: 0, // Tracks how many volunteers have signed up
    },
    targetItems: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantityNeeded: {
          type: Number,
          required: true,
          min: 1,
        },
        quantityDonated: {
          type: Number,
          default: 0,
        },
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Events = mongoose.model("Event", eventModel);
export default Events;
