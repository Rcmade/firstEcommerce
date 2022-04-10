const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const crypto = require("crypto");

const User = require("../models/UserModel");

const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

const cloudinary = require("cloudinary");

// register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(
    req.body.avatar,
    {
      folder: "avatars",
      width: "150",
      crop: "scale",
    },
    (error, result) => {
      console.log(result, error);
    }
  );

  const { name, email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    return res.status(404).json({ error: "This Email Is Already Registered" });
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return res.status(400).json({ message: "Please Enter Email & Password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  sendToken(user, 200, res);
});

//// logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logout " });
});

/// forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  /////${req.protocol}://${req.get("host")}/password/reset/${resetToken}

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = ` your password reset token is :- \n\n ${resetPasswordUrl} \n\n  if you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email Sent To ${user.email} Successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ error: error.message });
  }
});

// /Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      error: "Reset Password Token Is Invalid Or Has Been Expired",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(401).json({
      error: "Password Does Not Match",
    });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get User Details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

// Update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return res.status(401).json({
      error: "Old Password Is In Correct",
    });
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(404).json({
      error: "Password Does Not Match",
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);

});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user._id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(
      req.body.avatar,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      },
      (error, result) => {
        console.log(result, error);
      }
    );

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await user.save();

  res.status(200).json({
    success: true,
  });
});

// get All User, admin  only

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// get Single User, admin  only

exports.getSingleUsers = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(401).json({
      error: "User Does Not Exist  With This Id",
    });
  }
  res.status(200).json({ success: true, user });
});

// update User Role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // we will add cloudinary later

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: newUserData },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Delete User, Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // we will delete cloudinary later

  if (!user) {
    return res.status(401).json({
      error: "User Does Not Exist  With This Id" + req.params.id,
    });
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();

  res.status(200).json({
    success: true,
    message: "user Dleted successfully",
  });
});
