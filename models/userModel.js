import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    ipAdd: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    location: {
        latitude: {
            type: Number,
            default: 0,
            required: true
        },
        longitude: {
            type: Number,
            default: 0,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    attendance: [
        {
            date: {
                type: Date,
                required: true,
            },
            status: {
                type: String,
                required: true,
            },
        }
    ]
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    next();
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + process.env.RESET_PASS_EXPIRE *60*1000;
    return resetToken;
}

export const User = mongoose.model("User", userSchema);