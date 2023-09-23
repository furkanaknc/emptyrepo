const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../config/keys').secret;
const User = require('../models/Users');


 const registerUser = async (req, res) => {
    try {
        let {
            userName,
            password,
            confirm_password
        } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({
                msg: "Password do not match."
            });
        }

        const existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email is already registered. Did you forget your password."
            });
        }

        const newUser = new User({
            userName,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: "User is now registered."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.body.userName });
        if (!user) {
            return res.status(404).json({
                msg: "User name not found.",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            const payload = {
                _id: user._id,
                userName:user.userName,
            };
            const token = jwt.sign(payload, key, { expiresIn: 604800 });

            return res.status(200).json({
                success: true,
                token: `Bearer ${token}`,
                user: user,
                msg: "You are now logged in."
            });
        } else {
            return res.status(404).json({
                msg: "Incorrect password.",
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
};


const getUserProfile = async (req, res) => {
    try {
        return res.json({
            user: req.user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};