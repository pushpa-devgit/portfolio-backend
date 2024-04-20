import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

import customErrorResponse from "../utilities/exception_response.utility.js";

export const registerUser = async (req, res, next) => {
  const { fullName, username, password, email, photo } = req.body;
  console.log(fullName, username, password, email, photo);

  if (!fullName || !username || !password || !email)
    return next(customErrorResponse(400, "required fields can't be empty."));

  const enc_password = bcryptjs.hashSync(password, 10);
  const newUser = User({
    fullName,
    username,
    password: enc_password,
    email,
    photo,
  });

  try {
    const user = await newUser.save();
    res.status(201).json({
      success: true,
      fullName,
      username,
      email,
      photo: user._doc.photo,
    });
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      if (error.message.includes("username"))
        return next(customErrorResponse(500, "Username already taken!"));
      else if (error.message.includes("email"))
        return next(customErrorResponse(500, "Email already taken!"));
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  if (!(username || email) || !password) {
    return next(
      customErrorResponse(400, "username/email and password are required!")
    );
  }

  try {
    let user;
    if (username) {
      user = await User.findOne({ username });
    } else {
      user = await User.findOne({ email });
    }
    if (!user) return next(customErrorResponse(400, "user not found!"));
    if (!bcryptjs.compareSync(password, user.password))
      return next(customErrorResponse(400, "password doesn't match"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SALT);
    const userData = user.toObject();
    delete userData.password;
    userData["token"] = token;
    res.status(200).json({ success: true, userData });
    // .cookie("access_token", token, { httpOnly: true })
    // .json(rest);
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const search = req.query.search;
  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.json(users);
  } catch (error) {
    return next(error);
  }
};

export const getSelf = (req, res, next) => {
  res.json({ success: true, userData: req.user });
};
