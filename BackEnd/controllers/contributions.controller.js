import Donation from "../models/donationModel.js";
import ItemDonation from "../models/itemDonationModel.js";
import Volunteer from "../models/volunteerModel.js";
import Events from "../models/eventsModel.js";

// Function to get donations by eventId
export const getDonationsByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Fetch the event details manually
    const event = await Events.findById(eventId).select(
      "_id title type location startDate endDate"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Fetch donations for the event, excluding the eventId field
    const donations = await Donation.find({ eventId }, { eventId: 0 });

    res.status(200).json({
      message: "Donations fetched successfully",
      event: {
        _id: event._id,
        title: event.title,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
      donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get item donations by eventId
export const getItemDonationsByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Fetch the event details manually
    const event = await Events.findById(eventId).select(
      "_id title type location startDate endDate"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Fetch item donations for the event, excluding the eventId field
    const itemDonations = await ItemDonation.find({ eventId }, { eventId: 0 });

    res.status(200).json({
      message: "Item donations fetched successfully",
      event: {
        _id: event._id,
        title: event.title,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
      itemDonations,
    });
  } catch (error) {
    console.error("Error fetching item donations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get volunteers by eventId
export const getVolunteersByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Fetch the event details manually
    const event = await Events.findById(eventId).select(
      "_id title type location startDate endDate"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Fetch volunteers for the event, excluding the eventId field
    const volunteers = await Volunteer.find({ eventId }, { eventId: 0 });

    res.status(200).json({
      message: "Volunteers fetched successfully",
      event: {
        _id: event._id,
        title: event.title,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
      volunteers,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};