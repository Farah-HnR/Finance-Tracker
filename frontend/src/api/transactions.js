import client from "./client";

export const getTransactions = (params) =>
  client.get("/api/v1/transactions", { params });

export const createTransaction = (data) =>
  client.post("/api/v1/transactions", data);

export const deleteTransaction = (id) =>
  client.delete(`/api/v1/transactions/${id}`);
