import Events from "../models/eventsModel.js";
import ItemDonation from "../models/itemDonationModel.js";
import User from "../models/userModel.js";

export const addItemDonation = async (req, res) => {
  try {
    const { userId, eventId, items, name, email, phone, address } = req.body;
    if (!eventId || !items || !name || !email || !phone || !address) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one item must be provided." });
    }

    for (const item of items) {
      if (!item.name || !item.quantityDonated || item.quantityDonated < 1) {
        return res.status(400).json({
          message:
            "Each item must have a name and a valid quantity donated (at least 1).",
        });
      }
    }

    const itemDonation = new ItemDonation({
      userId, // Optional: Only for logged-in users
      eventId,
      items,
      name,
      email,
      phone,
      address,
      status: "pending",
    });

    const savedItemDonation = await itemDonation.save();

    res.status(201).json({
      message: "Item donation added successfully",
      itemDonation: savedItemDonation,
    });
  } catch (error) {
    console.error("Error adding item donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmItemDonation = async (req, res) => {
  const itemDonationId = req.params.id;
  try {
    const itemDonation = await ItemDonation.findById(itemDonationId);
    if (!itemDonation) {
      return res.status(400).json({ message: "The item Donation was not found" });
    }

    if (itemDonation.status === "confirmed") {
      return res
        .status(400)
        .json({ message: "The itemDonation has already been confirmed" });
    }
    


    const event = await Events.findById(itemDonation.eventId);
    if (!event) {
      return res.status(400).json({ message: "The event was not found" });
    }

    itemDonation.status = "confirmed";
    await itemDonation.save();
    
    let totalItems = 0;
    for (let item of itemDonation.items) {
      const targetItem = event.targetItems.find(
        (eventItem) => eventItem.name === item.name
      );
      if (targetItem) {
        targetItem.quantityDonated += item.quantityDonated;
        totalItems += item.quantityDonated;
      }
    }
    
    if (itemDonation.userId) {
      const user = await User.findById(itemDonation.userId);
      if (user) {
        user.impact.totalItems += totalItems;
        user.impact.totalContributions += 1;
        await user.save();
      }
    }
    
    await event.save();
    res.status(201).json({
      message: "ItemDonation confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming itemDonation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getItemDonation = async (req, res) => {
  const { userId } = req.body;

  try {
    const itemDonations = await ItemDonation.find({ userId }).populate({
      path: "eventId",
      select: "title type targetItems", 
    });

    
    const itemDonationWithEventDetails = itemDonations.map((itemDonation) => ({
      _id: itemDonation._id,
      event: itemDonation.eventId,
      items: itemDonation.items,
      status: itemDonation.status,
      createdAt: itemDonation.createdAt,
      updatedAt: itemDonation.updatedAt,
    }));

    res.status(200).json(itemDonationWithEventDetails);
  } catch (error) {
    console.error("Error getting itemDonations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelItemDonation = async (req, res) => {
  const itemDonationId = req.params.id;
  try {
    const itemDonation = await ItemDonation.findById(itemDonationId);
    if (!itemDonation) {
      return res.status(400).json({ message: "The item donation was not found" });
    }

    if (itemDonation.status === "canceled") {
      return res
        .status(400)
        .json({ message: "The item donation has already been canceled" });
    }

    if (itemDonation.status === "confirmed") {
      const event = await Events.findById(itemDonation.eventId);
      if (event) {
        for (let item of itemDonation.items) {
          const targetItem = event.targetItems.find(
            (eventItem) => eventItem.name === item.name
          );
          if (targetItem) {
            targetItem.quantityDonated -= item.quantityDonated;
          }
        }

        if (itemDonation.userId) {
          const user = await User.findById(itemDonation.userId);
          if (user) {
            user.impact.totalItems -= itemDonation.items.reduce(
              (sum, item) => sum + item.quantityDonated,
              0
            );
            user.impact.totalContributions -= 1;
            await user.save();
          }
        }

        await event.save();
      }
    }

    itemDonation.status = "canceled";
    await itemDonation.save();

    res.status(200).json({
      message: "Item donation canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling item donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
