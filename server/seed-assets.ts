import "dotenv/config";
import mongoose from "mongoose";
import { SystemAsset } from "./models/SystemAsset";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

function categoryCodeFor(category: string): string {
  switch (category) {
    case "mouse": return "M";
    case "keyboard": return "K";
    case "motherboard": return "MB";
    case "ram": return "R";
    case "power-supply": return "PS";
    case "headphone": return "H";
    case "camera": return "C";
    case "monitor": return "MN";
    case "vonage": return "V";
    case "storage": return "ST";
    default: return "X";
  }
}

function getVendorForCategory(category: string, index: number): string {
  const vendors: Record<string, string[]> = {
    mouse: ["Logitech", "Razer", "SteelSeries", "HP", "Dell"],
    keyboard: ["Corsair", "Logitech", "Keychron", "HP", "Dell"],
    motherboard: ["ASUS", "MSI", "Gigabyte", "ASRock"],
    ram: ["Corsair", "Kingston", "G.Skill", "Crucial"],
    "power-supply": ["EVGA", "Corsair", "Seasonic", "Cooler Master"],
    headphone: ["Sony", "Bose", "Sennheiser", "Audio-Technica"],
    camera: ["Logitech", "Sony", "Canon", "Microsoft"],
    monitor: ["Dell", "LG", "Samsung", "ASUS", "HP"],
    vonage: ["Vonage"],
    storage: ["Samsung", "Western Digital", "Seagate", "Crucial"],
  };

  const list = vendors[category] || ["Generic"];
  return list[index % list.length];
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB for seeding...");

    const categories = [
      { name: "mouse", count: 12 },
      { name: "keyboard", count: 12 },
      { name: "motherboard", count: 12 },
      { name: "ram", count: 12 },
      { name: "power-supply", count: 12 },
      { name: "headphone", count: 12 },
      { name: "camera", count: 12 },
      { name: "monitor", count: 12 },
      { name: "storage", count: 12 },
      { name: "vonage", count: 2 },
    ];

    const today = new Date().toISOString();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const warranty = oneYearLater.toISOString();

    for (const cat of categories) {
      console.log(`Seeding ${cat.count} items for ${cat.name}...`);
      const code = categoryCodeFor(cat.name);
      
      for (let i = 1; i <= cat.count; i++) {
        const id = `WX-${code}-${String(i).padStart(3, "0")}`;
        
        // Check if exists
        const existing = await SystemAsset.findOne({ id });
        if (existing) {
          console.log(`  Skipping ${id} (already exists)`);
          continue;
        }

        const assetData: any = {
          id,
          category: cat.name,
          serialNumber: `${cat.name.toUpperCase()}-SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          vendorName: getVendorForCategory(cat.name, i),
          companyName: i % 2 === 0 ? "Tech Solutions Inc" : "Business Corp",
          purchaseDate: "2024-01-01",
          warrantyEndDate: warranty,
        };

        if (cat.name === "vonage") {
          assetData.vonageNumber = `+1-555-${100 + i}-${2000 + i}`;
          assetData.vonageExtCode = `${100 + i}`;
          assetData.vonagePassword = `pass${100 + i}!`;
        } else if (cat.name === "ram") {
          assetData.ramSize = i % 2 === 0 ? "16GB" : "8GB";
          assetData.ramType = "DDR4";
        } else if (cat.name === "motherboard") {
          assetData.processorModel = i % 2 === 0 ? "Intel i7" : "Intel i5";
        } else if (cat.name === "storage") {
          assetData.storageType = i % 2 === 0 ? "SSD" : "HDD";
          assetData.storageCapacity = i % 2 === 0 ? "512GB" : "1TB";
        }

        const asset = new SystemAsset(assetData);
        await asset.save();
        console.log(`  Created ${id}`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
