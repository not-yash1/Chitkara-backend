import { User } from "../models/userModel.js";
import haversine from "haversine-distance"
// const { haversine } = pkg


export const registerUser = async (req, res) => {
    try {

        const { name, email, password, userAgent, ip, latitude, longitude } = req.body;

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
            location: {
                latitude,
                longitude
            }
        });

        await user.save();

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true
        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        });

        // res.status(201).json({ 
        //     success: true, 
        //     message: "User registered successfully", 
        //     token,
        //     user,
        // });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}

export const loginUser = async (req, res) => {
    try {

        const { email, password, userAgent, ip, latitude, longitude } = req.body;
        console.log("Latitude: ", latitude, "Longitude: ", longitude);

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

        if(user.ipAdd !== ip || user.userAgent !== userAgent){
            return res.status(401).json({
                success: false,
                message: "Device changed"
            })
        }

        const start = { latitude: user.location.latitude, longitude: user.location.longitude };
        const end = { latitude, longitude };

        console.log('Working...')
        const distance = haversine(start, end);
        console.log('After Working...')

        if (distance > 5) {
            return res.status(403).json({ 
                success: false, 
                message: 'Login location is not within the allowed radius' 
            });
        }

        console.log("Location is within the allowed radius");

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
            user,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: "none",
            secure: true
        }).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}