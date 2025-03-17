import validator from 'validator'
import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// api to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if(!name || !email || !password) {
            return res.json({success: false, message: "miss data"})
        }

        if(!validator.isEmail(email)) {
            return res.json({success: false, message: 'enter valid email'})
        }

        if( password < 8) {
            return res.json({success: false, message: 'enter a strong password'})
        }

        // hashing password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const userData = {
            name,
            email, 
            password : hashedPassword 
        }

        const newUser = new userModel(userData)
        const user  =  await newUser.save()
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token})



    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }

}

export { registerUser }