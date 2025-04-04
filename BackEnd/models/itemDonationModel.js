import mongoose from "mongoose";

const itemDonationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantityDonated: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ItemDonation = mongoose.model("ItemDonation", itemDonationSchema);

export default ItemDonation;