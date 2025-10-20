import asyncHandler from "express-async-handler";
import userModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // 2. Find user by email
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 3. Check if account is locked
  if (user.isLock) {
    res.status(403);
    throw new Error("Account is locked. Contact admin.");
  }

  // 4. Verify password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 5. Create JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  // 6. Return user info and token
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site in prod, lax in dev
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: { en: "logged in successfully", ar: "تم تسجيل الدخول بنجاح" },
    token,
  });
});

// import { sendMail } from "../utilities/sendEmail.utilies.js";

const generateToken = (id, userName, role) => {
  return jwt.sign({ id, userName, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const isCorrectPassword = async (currentPassword, userPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

// export const signUp = asyncHandler(async (req, res, next) => {
//   const {
//     userName,
//     email,
//     password,
//     confirmPassword,
//     gender,
//     role,
//     dateOfBirth,
//     phoneNumber,
//   } = req.body;

//   if (!userName || !email || !password || !confirmPassword) {
//     return next(
//       new AppError(
//         {
//           en: "Please provide all required fields",
//           ar: "يرجى تقديم جميع الحقول المطلوبة",
//         },
//         400
//       )
//     );
//   }
//   if (password !== confirmPassword) {
//     return next(
//       new AppError(
//         {
//           en: "Passwords do not match",
//           ar: "كلمات المرور غير متطابقة",
//         },
//         400
//       )
//     );
//   }

//   const isUserExist = await userModel.findOne({ email });
//   if (isUserExist) {
//     return next(
//       new AppError(
//         {
//           en: "User already exists",
//           ar: "المستخدم موجود بالفعل",
//         },
//         409
//       )
//     );
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//   const profilePic =
//     "https://res.cloudinary.com/dxfmw4nch/image/upload/v1753882410/profilePics/muxts6jedfnjupzdqzgf.jpg";

//   const user = await userModel.create({
//     userName,
//     email,
//     password,
//     gender,
//     role,
//     dateOfBirth,
//     phoneNumber,
//     profilePic,
//     otp,
//     otpExpiresAt,
//   });

//   // await sendOTPEmail(user.email, otp);
//   //   await sendMail(user.email, otp);
//   res.status(201).json({
//     status: "success",
//     message: { en: "User created successfully", ar: "تم إنشاء المستخدم بنجاح" },
//   });
// });

// export const logout = asyncHandler(async (req, res, next) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     path: "/",
//   });

//   res.status(200).json({
//     status: "success",
//     message: { en: "Logged out successfully", ar: "تم تسجيل الخروج بنجاح" },
//   });
// });

export default {
  login,
};
