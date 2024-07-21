import { User } from "../models/userModel.js";


export const registerUser = async (req, res) => {
    try {

        const { name, email, password, userAgent, ip } = req.body;

        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        user = await User.create({
            name,
            email,
            password,
            ipAdd: ip,
            userAgent,
        });

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully", 
            // data: user
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}

export const loginUser = async (req, res) => {
    try {

        const { email, password, userAgent, ip } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            })
        }

        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        if(user.ipAdd !== req.userIp){
            return res.status(401).json({
                success: false,
                message: "Device changed"
            })
        }

        console.log("IP matched")

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            message: "Logged in successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}