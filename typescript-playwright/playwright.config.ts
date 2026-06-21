import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  testDir: "./tests",
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  outputDir: "./test-results",
  grepInvert: /@security/,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080/api",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    extraHTTPHeaders: {
      Origin: "http://localhost:8080",
    },
  },

  projects: [{ 
    name: "chromium", 
    use: { 
      ...devices["Desktop Chrome"],
      channel: 'chrome',
    } 
  }],
});
