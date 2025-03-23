import cloudinary from "../config/cloudinary.js";
import RequestHelp from "../models/requestsModel.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });


export const addRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      helpType,
      description,
      urgency,
      incomeLevel,
      referralSource,
      consent,
    } = req.body;

    const images = req.files

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !address ||
      !phone ||
      !helpType ||
      !description ||
      !urgency ||
      consent === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const imagesURL = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const fileBuffer = images[i].buffer; // Extract the file buffer
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(fileBuffer); // Upload the file buffer
        });
        imagesURL.push(uploadResponse.secure_url);
      }
    }

    const newRequest = new RequestHelp({
      fullName,
      email,
      phone,
      address,
      helpType,
      description,
      urgency,
      images : imagesURL,
      incomeLevel,
      referralSource,
      consent,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestHelp.find({}).sort({ createdAt: -1 }); // Fetch all requests, sorted by creation date (newest first)
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const acceptRequest = async (req, res) => {
  const  requestId  = req.params.id; 

  try {
    const updatedRequest = await RequestHelp.findByIdAndUpdate(
      requestId,
      { status: "accepted" }, 
      { new: true } 
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Request accepted", request: updatedRequest });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const refuseRequest = async (req, res) => {
  const  requestId  = req.params.id; 
  console.log(requestId);

  try {
    const updatedRequest = await RequestHelp.findByIdAndUpdate(
      requestId,
      { status: "refused" }, 
      { new: true } 
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Request refused", request: updatedRequest });
  } catch (error) {
    console.error("Error refusing request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};