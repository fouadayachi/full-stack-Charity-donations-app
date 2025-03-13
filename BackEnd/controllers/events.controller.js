import Events from "../models/eventsModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      title,
      shortDescription,
      longDescription,
      type,
      targetAmount,
      targetItems,
      targetVolunteers,
      volunteerHours,
      location,
      startDate,
      endDate,
      mainImage,
      images
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !type ||
      !location ||
      !startDate ||
      !endDate ||
      !mainImage
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

    // Create a new post
    const newEvent = new Events({
      title,
      shortDescription,
      longDescription,
      type,
      targetAmount: type === "donation" ? targetAmount : undefined,
      targetItems: type === "items" ? targetItems : undefined,
      targetVolunteers: type === "volunteer" ? targetVolunteers : undefined,
      volunteerHours,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      mainImage,
      images
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


export const getEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; 
    const total = await Events.countDocuments();
    const events = await Events.find().limit(limit).sort({ createdAt: -1 }); 
    res.status(200).json({ message: 'Posts fetched successfully', events : events,total });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const getEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id); 
    if(!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event fetched successfully', event });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

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
    if (sortBy === 'newest') {
      sort.createdAt = -1; // Newest first
    } else if (sortBy === 'urgent') {
      sort.endDate = 1; // Earliest end date first (most urgent)
    } else if (sortBy === 'ending') {
      sort.endDate = 1; // Earliest end date first (ending soonest)
    }
    const total = await Events.countDocuments(filter);

    // Fetch filtered and sorted posts
    const events = await Events.find(filter).skip(skip).sort(sort).limit(limit);
    res.status(200).json({ message: 'Posts fetched successfully using ' , events: events,total });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}

export const saveEvent = async (req, res) => {
  const {eventId,userId} = req.body;
  try {
    const user = await User.findById(userId);

    // Check if the event is already saved
    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId); // Add the event ID to the array
      await user.save();
      res.status(200).json({ message: 'Event saved successfully' });
    } else {
      res.status(400).json({ message: 'Event is already saved and ' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
}

export const unsaveEvent = async (req, res) => {
  const {eventId,userId} = req.body;
  try {
    const user = await User.findById(userId);

    // Check if the event is saved
    if (user.savedEvents.includes(eventId)) {
      user.savedEvents = user.savedEvents.filter((id) => id.toString() !== eventId); // Remove the event ID
      await user.save();
      res.status(200).json({ message: 'Event unsaved successfully' });
    } else {
      res.status(400).json({ message: 'Event is not saved' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
}