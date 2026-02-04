import cloudinary from "../config/cloudinary.js";
import ShowcaseCard from "../models/showCaseModel.js";

export const getShowCases = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = 3;
  try {
    const showCases = await ShowcaseCard.find({}).skip(skip).limit(limit);
    const total = await ShowcaseCard.countDocuments();
    res.status(200).json({ message: "success", showCases, total });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
export const getShowCase = async (req, res) => {
  try {
    const showCase = await ShowcaseCard.findById(req.params.id);
    if (!showCase) {
      return res.status(404).json({ message: "Showcase not found" });
    }
    res.status(200).json({ message: "success", showCase });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const addShowCase = async (req, res) => {
  const {
    title,
    shortDescription,
    longDescription,
    location,
    keyAchievements,
    startDate,
    endDate,
  } = req.body;

  const { mainImage, images } = req.files;

  const mainImageFile = mainImage ? mainImage[0] : null;

  const additionalImages = images || [];
  if (
    !title ||
    !shortDescription ||
    !longDescription ||
    !mainImage ||
    !location ||
    !images ||
    !keyAchievements ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fileBuffer = mainImageFile.buffer;
  const uploadResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
  const mainImageUrl = uploadResponse.secure_url;

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

  try {
    const newShowCase = new ShowcaseCard({
      title,
      shortDescription,
      longDescription,
      mainImage: mainImageUrl,
      location,
      images: imagesURL,
      keyAchievements,
      startDate,
      endDate,
    });
    await newShowCase.save();
    res.status(201).json({ message: "ShowCase added successfully" });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const updateShowCase = async (req, res) => {
  try {
    const showCaseId = req.params.id;
    const {
      title,
      shortDescription,
      longDescription,
      location,
      keyAchievements,
      startDate,
      endDate,
    } = req.body;

    // const { mainImage, images } = req.files;

    // Find the event by ID
    const showcase = await ShowcaseCard.findById(showCaseId);
    if (!showcase) {
      return res.status(404).json({ message: "Show case not found" });
    }

    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !location ||
      !keyAchievements ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
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

    showcase.title = title;
    showcase.shortDescription = shortDescription;
    showcase.longDescription = longDescription;
    showcase.location = location;
    showcase.keyAchievements = keyAchievements;
    showcase.startDate = startDate;
    showcase.endDate = endDate;

    
    // showcase.mainImage = mainImageUrl;
    // showcase.images = imagesURL;

    // Save the updated showcase
    await showcase.save();

    // Return the updated event
    res.status(200).json({ message: "Showcase updated successfully", showcase });
  } catch (error) {
    console.error("Error updating showcase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllShowCases = async (req, res) => {
  try {
    const showCases = await ShowcaseCard.find({});
    res.status(200).json({ message: "success", showCases });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const deleteShowCase = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShowCase = await ShowcaseCard.findByIdAndDelete(id);

    if (!deletedShowCase) {
      return res.status(404).json({ message: "Showcase not found" });
    }

    res.status(200).json({ message: "Showcase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
