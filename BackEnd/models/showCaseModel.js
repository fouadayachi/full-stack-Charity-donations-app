import mongoose from "mongoose";


const ShowcaseCardSchema = new mongoose.Schema({
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
    type: String,
    required: true, 
  },
  location: {
    type: String,
    required: true, 
  },
  images: [{
    type: String, 
    required: true,
  }],
  keyAchievements: [{
    type: String,
    required: true, 
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

},{timestamps: true});




const ShowcaseCard = mongoose.model('ShowcaseCard', ShowcaseCardSchema);

export default ShowcaseCard;