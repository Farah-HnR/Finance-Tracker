import client from "./client";

export const getMonthlySummary = (month, year) =>
  client.get("/api/v1/reports/monthly-summary", { params: { month, year } });

export const getCategoryBreakdown = (month, year) =>
  client.get("/api/v1/reports/category-breakdown", { params: { month, year } });
