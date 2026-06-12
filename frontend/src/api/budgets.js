import client from "./client";

export const getBudgets = (params) =>
  client.get("/api/v1/budgets", { params });

export const createBudget = (data) => client.post("/api/v1/budgets", data);

export const getBudgetStatus = (month, year) =>
  client.get("/api/v1/budgets/status", { params: { month, year } });

export const deleteBudget = (id) => client.delete(`/api/v1/budgets/${id}`);
