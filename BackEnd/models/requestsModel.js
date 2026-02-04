import mongoose from 'mongoose';


const RequestHelpSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  helpType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'], 
  },

  images: [{
    type: String, 
    required: false, 
  }],

  incomeLevel: {
    type: String,
    required: false,
  },
  referralSource: {
    type: String,
    required: false,
  },

  // Consent
  consent: {
    type: Boolean,
    required: true,
    default: false,
  },

  status : {
    type: String,
    enum: ['pending', 'refused', 'accepted'],
    default: 'pending'
  }


},{timestamps : true});



// Create the Mongoose model
const RequestHelp = mongoose.model('RequestHelp', RequestHelpSchema);

export default RequestHelp;