import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js';

export const isAuthenticated = async(req, res, next) => {
    try {

        const {token} = await req.cookies;

        if(!token){
            return res.status(400).json({
                success: false,
                message: "Please login first"
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decodedData.id);

        // if(!req.admin){
        //     return res.status(404).json({
        //         success: false,
        //         message: "Admin not found"
        //     });
        // }

        next();
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}