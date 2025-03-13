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
      return res.status(404).json({ message: 'Showcase not found' });
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
    mainImage,
    location,
    images,
    keyAchievements,
    startDate,
    endDate,
  } = req.body;
  if (!title || !shortDescription || !longDescription  || !mainImage || !location || !images || !keyAchievements || !startDate || !endDate ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newShowCase = new ShowcaseCard({ title, shortDescription, longDescription, mainImage, location, images, keyAchievements, startDate, endDate });
    await newShowCase.save();
    res.status(201).json({ message: "ShowCase added successfully" });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
