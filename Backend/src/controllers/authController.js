import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../model/User.js";

export const register = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("username").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;
    try {
      const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });
      await user.save();
      res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập chưa chính xác" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Không có token, truy cập bị từ chối" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      address: user.address,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const updateUser = [
  body("username").optional().notEmpty(),
  body("address").optional().isString(),
  body("phoneNumber").optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Không có token, truy cập bị từ chối" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      const { username, address, phoneNumber } = req.body;
      if (username) user.username = username;
      if (address !== undefined) user.address = address;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

      await user.save();
      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        address: user.address,
        phoneNumber: user.phoneNumber,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
