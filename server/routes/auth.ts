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
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    res.json({
      success: true,
      data: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Change password endpoint
const changePassword: RequestHandler = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
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
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

router.post("/login", login);
router.post("/change-password", changePassword);

export { router as authRouter };
