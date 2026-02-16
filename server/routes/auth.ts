import { Router, RequestHandler } from "express";
import { User } from "../models/User";

const router = Router();

// Seed default users if they don't exist
export const seedUsers = async () => {
  try {
    console.log("Checking and seeding users...");
    const defaultUsers = [
      { username: "admin", password: "123", role: "admin" },
      { username: "it", password: "123", role: "it" },
      { username: "hr", password: "123", role: "hr" },
      { username: "it1", password: "123", role: "it" },
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      }
    }
    console.log("User seeding complete.");
    console.log("Available users: admin, it, it1, hr (all with password: 123)");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Login endpoint - TEMPORARILY BYPASSED FOR TESTING
const login: RequestHandler = async (req, res) => {
  try {
    // TEMPORARY: Accept any username/password for testing
    // Simply log in with default role
    const { username, password } = req.body || {};

    if (!username) {
      return res.json({
        success: true,
        data: {
          username: username || "guest",
          role: "it",
        },
      });
    }

    // Try to find user first
    const user = await User.findOne({ username });

    if (user) {
      // User exists - return their actual role
      return res.json({
        success: true,
        data: {
          username: user.username,
          role: user.role,
        },
      });
    }

    // User doesn't exist - allow login anyway with 'it' role
    res.json({
      success: true,
      data: {
        username: username,
        role: "it",
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

// Signup/Create user endpoint
const signup: RequestHandler = async (req, res) => {
  try {
    console.log("=== Signup Request ===");
    console.log("Body:", req.body);

    const { username, password, role } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Username already exists",
      });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      role: role || "it", // Default role is 'it'
    });

    await newUser.save();
    console.log("User created successfully:", username);

    res.status(201).json({
      success: true,
      data: {
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Change password endpoint
const changePassword: RequestHandler = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body || {};

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
router.post("/signup", signup);
router.post("/change-password", changePassword);

export { router as authRouter };
