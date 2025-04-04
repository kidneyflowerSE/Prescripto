import validator from "validator";
import bycrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log(
      {
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
      },
      imageFile
    );

    // checking for all data to add dotor
    if (!name) {
      return res.json({ success: false, message: "Missing Name" });
    }
    if (!email) {
      return res.json({ success: false, message: "Missing Email" });
    }
    if (!password) {
      return res.json({ success: false, message: "Missing Password" });
    }
    if (!speciality) {
      return res.json({ success: false, message: "Missing Speciality" });
    }
    if (!degree) {
      return res.json({ success: false, message: "Missing Degree" });
    }
    if (!experience) {
      return res.json({ success: false, message: "Missing Experience" });
    }
    if (!about) {
      return res.json({ success: false, message: "Missing About" });
    }
    if (!fees) {
      return res.json({ success: false, message: "Missing Fees" });
    }
    if (!address) {
      return res.json({ success: false, message: "Missing Address" });
    }
    

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "pls emter a valid email" });
    }

    // password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "pls enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const adminLogin = async (req, res) => {
  try {
    
    const { email, password } = req.body

    if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {
      const token = jwt.sign(email+password, process.env.JWT_SECRET)
      res.json({ success: true, message: "Login Successful" ,token});
    }
    else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// API to get all doctors list for admin 
const allDoctors = async (req, res) => {
  try {
    
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success: true, doctors})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { addDoctor, adminLogin, allDoctors};
