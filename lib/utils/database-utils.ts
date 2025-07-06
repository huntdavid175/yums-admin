import {
  seedDatabase,
  verifySeeding,
  clearDatabase,
} from "../examples/seed-database";

// ============================================================================
// DATABASE UTILITIES FOR BROWSER
// ============================================================================

export class DatabaseUtils {
  /**
   * Seed the database with sample categories and menu items
   */
  static async seedDatabase() {
    try {
      console.log("🌱 Starting database seeding...");
      const result = await seedDatabase();
      console.log("✅ Database seeded successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Database seeding failed:", error);
      throw error;
    }
  }

  /**
   * Verify the current state of the database
   */
  static async verifyDatabase() {
    try {
      console.log("🔍 Verifying database...");
      const result = await verifySeeding();
      console.log("✅ Database verification completed:", result);
      return result;
    } catch (error) {
      console.error("❌ Database verification failed:", error);
      throw error;
    }
  }

  /**
   * Clear all categories and menu items from the database
   * ⚠️ Use with caution - this will delete all data
   */
  static async clearDatabase() {
    try {
      const confirmed = confirm("⚠️ This will delete ALL data. Are you sure?");
      if (!confirmed) return;

      console.log("🗑️ Clearing database...");
      await clearDatabase();
      console.log("✅ Database cleared successfully");
    } catch (error) {
      console.error("❌ Database clearing failed:", error);
      throw error;
    }
  }

  /**
   * Reset the database by clearing and then seeding
   */
  static async resetDatabase() {
    try {
      console.log("🔄 Resetting database...");
      await this.clearDatabase();
      const result = await this.seedDatabase();
      console.log("✅ Database reset completed:", result);
      return result;
    } catch (error) {
      console.error("❌ Database reset failed:", error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats() {
    try {
      const result = await verifySeeding();
      return {
        categories: result.categories,
        menuItems: result.menuItems,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Failed to get database stats:", error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORT FOR BROWSER CONSOLE USAGE
// ============================================================================

// Make utilities available in browser console for testing
if (typeof window !== "undefined") {
  (window as any).DatabaseUtils = DatabaseUtils;

  // Add convenience functions to window
  (window as any).seedDB = () => DatabaseUtils.seedDatabase();
  (window as any).verifyDB = () => DatabaseUtils.verifyDatabase();
  (window as any).clearDB = () => DatabaseUtils.clearDatabase();
  (window as any).resetDB = () => DatabaseUtils.resetDatabase();
  (window as any).getDBStats = () => DatabaseUtils.getDatabaseStats();

  console.log("🔧 Database utilities loaded!");
  console.log("Available functions:");
  console.log("  - seedDB() - Seed database with sample data");
  console.log("  - verifyDB() - Verify current database state");
  console.log("  - clearDB() - Clear all data (with confirmation)");
  console.log("  - resetDB() - Clear and reseed database");
  console.log("  - getDBStats() - Get database statistics");
}
