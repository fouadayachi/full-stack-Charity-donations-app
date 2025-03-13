import Donation from "../models/donationModel.js";
import Events from "../models/eventsModel.js";
import User from "../models/userModel.js";

export const addDonation = async (req, res) => {
  try {
    const { userId, eventId, amount, paymentMethod, name, email, phone } =
      req.body;

    if (!eventId || !amount || !paymentMethod || !name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (amount < 10) {
      return res
        .status(400)
        .json({ message: "The donation amount must be at least 10." });
    }

    const donation = new Donation({
      userId, // Optional: Only for logged-in users
      eventId,
      amount,
      paymentMethod,
      name,
      email,
      phone,
      confirmed: false,
    });

    const savedDonation = await donation.save();

    res.status(201).json({
      message: "Donation added successfully",
      donation: savedDonation,
    });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmDonation = async (req, res) => {
  const donationId = req.params.id;
  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(400).json({ message: "The donation was not found" });
    }

    if (donation.confirmed) {
      return res
        .status(400)
        .json({ message: "The donation has already been confirmed" });
    }
    const event = await Events.findById(donation.eventId);
    if (!event) {
      return res.status(400).json({ message: "The event was not found" });
    }
    donation.confirmed = true;
    await donation.save();
    if (donation.userId) {
      const user = await User.findById(donation.userId);
      if (user) {
        user.impact.totalDonations += donation.amount;
        user.impact.totalContributions += 1;
        await user.save();
      }
    }

    event.currentAmount += donation.amount;
    await event.save();
    res.status(201).json({
      message: "Donation confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDonations = async (req, res) => {
  const { userId } = req.body;

  try {
    const donations = await Donation.find({ userId }).populate({
      path: "eventId",
      select: "title type targetAmount currentAmount", 
    });

    
    const donationsWithEventDetails = donations.map((donation) => ({
      _id: donation._id,
      event: donation.eventId,
      amount: donation.amount,
      confirmed: donation.confirmed,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
    }));

    res.status(200).json(donationsWithEventDetails);
  } catch (error) {
    console.error("Error getting donations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
