import { Router, RequestHandler } from "express";
import { User } from "../models/User";

const router = Router();

// Seed default users if they don't exist
export const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Seeding default users...");
      const defaultUsers = [
        { username: "admin", password: "123", role: "admin" },
        { username: "it", password: "123", role: "it" },
        { username: "hr", password: "123", role: "hr" },
      ];
      await User.insertMany(defaultUsers);
      console.log("Default users seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Login endpoint
const login: RequestHandler = async (req, res) => {
  try {
    // Debug logging
    console.log("Login request received");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("req.body:", req.body);
    console.log("req.body type:", typeof req.body);

    // Defensive check for request body
    if (!req.body) {
      console.error("Request body is undefined");
      return res.status(400).json({
        success: false,
        error: "Request body is missing",
      });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    console.log(`Login attempt for user: ${username}`);
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    console.log(`User ${username} logged in successfully`);
    res.json({
      success: true,
      data: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Change password endpoint
const changePassword: RequestHandler = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Request body is missing",
      });
    }

    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Username, old password, and new password are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== oldPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid current password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

router.post("/login", login);
router.post("/change-password", changePassword);

export { router as authRouter };
