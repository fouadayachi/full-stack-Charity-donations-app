import cloudinary from "../config/cloudinary.js";
import Donation from "../models/donationModel.js";
import Events from "../models/eventsModel.js";
import ItemDonation from "../models/itemDonationModel.js";
import User from "../models/userModel.js";
import Volunteer from "../models/volunteerModel.js";

export const createPost = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      title,
      shortDescription,
      longDescription,
      eventType,
      targetAmount,
      currentAmount,
      currentVolunteers,
      items,
      volunteersNeeded,
      hoursPerVolunteer,
      location,
      startDate,
      endDate,
    } = req.body;

    const { mainImage, images } = req.files;

    const mainImageFile = mainImage ? mainImage[0] : null;

    const additionalImages = images || [];

    // Validate required fields
    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !eventType ||
      !location ||
      !startDate ||
      !endDate ||
      !mainImage
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate eventType-specific fields
    if (eventType === "donation" && !targetAmount) {
      return res
        .status(400)
        .json({ message: "Target amount is required for donation posts" });
    }
    if (eventType === "volunteer" && !targetVolunteers) {
      return res
        .status(400)
        .json({ message: "Target volunteers is required for volunteer posts" });
    }
    if (eventType === "items" && (!targetItems || targetItems.length === 0)) {
      return res
        .status(400)
        .json({ message: "Target items are required for item posts" });
    }

    const fileBuffer = mainImageFile.buffer;
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fileBuffer); // Upload the file buffer
    });
    const mainImageUrl = uploadResponse.secure_url

    const imagesURL = [];
    if (additionalImages && additionalImages.length > 0) {
      for (let i = 0; i < additionalImages.length; i++) {
        const fileBuffer = additionalImages[i].buffer; // Extract the file buffer
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(fileBuffer); // Upload the file buffer
        });
        imagesURL.push(uploadResponse.secure_url);
      }
    }

    // Create a new post
    const newEvent = new Events({
      title,
      shortDescription,
      longDescription,
      type : eventType,
      targetAmount: eventType === "donation" ? targetAmount : undefined,
      currentAmount: eventType === "donation" ? currentAmount : undefined,
      targetItems: eventType === "items" ? items : undefined,
      targetVolunteers: eventType === "volunteer" ? volunteersNeeded : undefined,
      currentVolunteers: eventType === "volunteer" ? currentVolunteers : undefined,
      volunteerHours : eventType === "volunteer " ? hoursPerVolunteer : undefined,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      mainImage : mainImageUrl,
      images : imagesURL,
    });

    // Save the post to the database
    await newEvent.save();

    // Return the created post
    res
      .status(201)
      .json({ message: "Post created successfully", post: newEvent });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const {
      title,
      shortDescription,
      longDescription,
      type,
      status,
      targetAmount,
      currentAmount,
      targetVolunteers,
      currentVolunteers,
      volunteerHours,
      targetItems,
      location,
      startDate,
      endDate,
    } = req.body;

    // const { mainImage, images } = req.files;

    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !type ||
      !location ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    

    // Validate type-specific fields
    if (type === "donation" && !targetAmount) {
      return res
        .status(400)
        .json({ message: "Target amount is required for donation posts" });
    }
    if (type === "volunteer" && !targetVolunteers) {
      return res
        .status(400)
        .json({ message: "Target volunteers is required for volunteer posts" });
    }
    if (type === "items" && (!targetItems || targetItems.length === 0)) {
      return res
        .status(400)
        .json({ message: "Target items are required for item posts" });
    }

    // Handle main image upload if provided
    // let mainImageUrl = event.mainImage;
    // if (mainImage) {
    //   const mainImageFile = mainImage[0];
    //   const fileBuffer = mainImageFile.buffer;
    //   const uploadResponse = await new Promise((resolve, reject) => {
    //     cloudinary.uploader
    //       .upload_stream({ resource_type: "auto" }, (error, result) => {
    //         if (error) reject(error);
    //         else resolve(result);
    //       })
    //       .end(fileBuffer);
    //   });
    //   mainImageUrl = uploadResponse.secure_url;
    // }

    // // Handle additional images upload if provided
    // let imagesURL = event.images;
    // if (images && images.length > 0) {
    //   for (let i = 0; i < images.length; i++) {
    //     const fileBuffer = images[i].buffer;
    //     const uploadResponse = await new Promise((resolve, reject) => {
    //       cloudinary.uploader
    //         .upload_stream({ resource_type: "auto" }, (error, result) => {
    //           if (error) reject(error);
    //           else resolve(result);
    //         })
    //         .end(fileBuffer);
    //     });
    //     imagesURL.push(uploadResponse.secure_url);
    //   }
    // }

    // Update the event with the new data
    event.title = title;
    event.status = status;
    event.shortDescription = shortDescription;
    event.longDescription = longDescription;
    event.targetAmount = type === "donation" ? targetAmount : undefined;
    event.currentAmount = type === "donation" ? currentAmount : undefined;
    event.targetVolunteers = type === "volunteer" ? targetVolunteers : undefined;
    event.currentVolunteers = type === "volunteer" ? currentVolunteers : undefined;
    event.volunteerHours = type === "volunteer" ? volunteerHours : undefined;
    event.targetItems = type === "items" ? targetItems : undefined;
    event.location = location;
    event.startDate = new Date(startDate);
    event.endDate = new Date(endDate);
    // event.mainImage = mainImageUrl;
    // event.images = imagesURL;

    // Save the updated event
    await event.save();

    // Return the updated event
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Events.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated contributions
    await Donation.deleteMany({ eventId });
    await ItemDonation.deleteMany({ eventId });
    await Volunteer.deleteMany({ eventId });

    res.status(200).json({ message: "Event and associated contributions deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const total = await Events.countDocuments();
    const events = await Events.find().limit(limit).sort({ createdAt: -1 });

    // Add pendingContributions property to each event
    const eventsWithPendingContributions = await Promise.all(
      events.map(async (event) => {
        let pendingContributions = 0;

        if (event.type === "volunteer") {
          pendingContributions = await Volunteer.countDocuments({
            eventId: event._id,
            status: "pending",
          });
        } else if (event.type === "items") {
          pendingContributions = await ItemDonation.countDocuments({
            eventId: event._id,
            status: "pending",
          });
        } else if (event.type === "donation") {
          pendingContributions = await Donation.countDocuments({
            eventId: event._id,
            status: "pending",
          });
        }

        return {
          ...event.toObject(),
          pendingContributions,
        };
      })
    );

    res.status(200).json({
      message: "Posts fetched successfully",
      events: eventsWithPendingContributions,
      total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event fetched successfully", event });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFilterEvents = async (req, res) => {
  try {
    const { type, sortBy } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    // Build the filter object
    const filter = {};
    if (type && type !== "all") filter.type = type; // Only apply type filter if provided

    // Build the sort object
    const sort = {};
    if (sortBy === "newest") {
      sort.createdAt = -1; // Newest first
    } else if (sortBy === "urgent") {
      sort.endDate = 1; // Earliest end date first (most urgent)
    } else if (sortBy === "ending") {
      sort.endDate = 1; // Earliest end date first (ending soonest)
    }
    const total = await Events.countDocuments(filter);

    // Fetch filtered and sorted posts
    const events = await Events.find(filter).skip(skip).sort(sort).limit(limit);
    res.status(200).json({
      message: "Posts fetched successfully using ",
      events: events,
      total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const saveEvent = async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    const user = await User.findById(userId);

    // Check if the event is already saved
    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId); // Add the event ID to the array
      await user.save();
      res.status(200).json({ message: "Event saved successfully" });
    } else {
      res.status(400).json({ message: "Event is already saved and " });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const unsaveEvent = async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    const user = await User.findById(userId);

    // Check if the event is saved
    if (user.savedEvents.includes(eventId)) {
      user.savedEvents = user.savedEvents.filter(
        (id) => id.toString() !== eventId
      ); // Remove the event ID
      await user.save();
      res.status(200).json({ message: "Event unsaved successfully" });
    } else {
      res.status(400).json({ message: "Event is not saved" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
