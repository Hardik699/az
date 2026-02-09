import { Router, RequestHandler } from "express";
import { PCLaptop } from "../models/PCLaptop";

const router = Router();

// Get all PC/Laptop records
const getPCLaptops: RequestHandler = async (_req, res) => {
  try {
    const pcLaptops = await PCLaptop.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: pcLaptops,
      count: pcLaptops.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch PC/Laptop records",
    });
  }
};

// Get PC/Laptop by ID
const getPCLaptopById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const pcLaptop = await PCLaptop.findOne({ id });

    if (!pcLaptop) {
      return res.status(404).json({
        success: false,
        error: "PC/Laptop record not found",
      });
    }

    res.json({
      success: true,
      data: pcLaptop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch PC/Laptop record",
    });
  }
};

// Create PC/Laptop record
const createPCLaptop: RequestHandler = async (req, res) => {
  try {
    const pcLaptopData = req.body;

    // Check if PC/Laptop with same ID already exists
    const existing = await PCLaptop.findOne({ id: pcLaptopData.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "PC/Laptop with this ID already exists",
      });
    }

    const pcLaptop = new PCLaptop(pcLaptopData);
    await pcLaptop.save();

    res.status(201).json({
      success: true,
      data: pcLaptop,
      message: "PC/Laptop record created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create PC/Laptop record",
    });
  }
};

// Update PC/Laptop record
const updatePCLaptop: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pcLaptop = await PCLaptop.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pcLaptop) {
      return res.status(404).json({
        success: false,
        error: "PC/Laptop record not found",
      });
    }

    res.json({
      success: true,
      data: pcLaptop,
      message: "PC/Laptop record updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update PC/Laptop record",
    });
  }
};

// Delete PC/Laptop record
const deletePCLaptop: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const pcLaptop = await PCLaptop.findByIdAndDelete(id);

    if (!pcLaptop) {
      return res.status(404).json({
        success: false,
        error: "PC/Laptop record not found",
      });
    }

    res.json({
      success: true,
      data: pcLaptop,
      message: "PC/Laptop record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete PC/Laptop record",
    });
  }
};

router.get("/", getPCLaptops);
router.get("/:id", getPCLaptopById);
router.post("/", createPCLaptop);
router.put("/:id", updatePCLaptop);
router.delete("/:id", deletePCLaptop);

export { router as pcLaptopRouter };
