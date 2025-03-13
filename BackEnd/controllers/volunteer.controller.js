import Events from "../models/eventsModel.js";
import User from "../models/userModel.js";
import Volunteer from "../models/volunteerModel.js";

export const addVolunteer = async (req, res) => {
  try {
    const { userId, eventId, name, email, phone, address } = req.body;

    if (!eventId || !name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const volunteer = new Volunteer({
      userId, // Optional: Only for logged-in users
      eventId,
      name,
      email,
      phone,
      address,
      confirmed: false,
    });

    const savedVolunteer = await volunteer.save();

    res.status(201).json({
      message: "Volunteer added successfully",
      volunteer: savedVolunteer,
    });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmVolunteer = async (req, res) => {
  const volunteerId = req.params.id;
  try {
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(400).json({ message: "The volunteer was not found" });
    }

    if (volunteer.confirmed) {
      return res
        .status(400)
        .json({ message: "The volunteer has already been confirmed" });
    }
    const event = await Events.findById(volunteer.eventId);
    if (!event) {
      return res.status(400).json({ message: "The event was not found" });
    }

    volunteer.confirmed = true;
    await volunteer.save();
    if(volunteer.userId){
      const user = await User.findById(volunteer.userId);
      if(user){
        user.impact.totalHours += event.volunteerHours;
        user.impact.totalContributions += 1;
        await user.save();
      }
    }

    event.currentVolunteers += 1;
    await event.save();
    res.status(201).json({
      message: "Volunteer confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getVolunteers = async (req, res) => {
  const { userId } = req.body;

  try {
    const volunteer = await Volunteer.find({ userId }).populate({
      path: "eventId",
      select: "title type targetVolunteers currentVolunteers volunteerHours", 
    });

    
    const volunteerWithEventDetails = volunteer.map((volunteer) => ({
      _id: volunteer._id,
      event: volunteer.eventId,
      confirmed: volunteer.confirmed,
      createdAt: volunteer.createdAt,
      updatedAt: volunteer.updatedAt,
    }));

    res.status(200).json(volunteerWithEventDetails);
  } catch (error) {
    console.error("Error getting volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
