import client from "./client";

export const getCategories = () => client.get("/api/v1/categories");

export const getCategory = (id) => client.get(`/api/v1/categories/${id}`);

export const createCategory = (data) => client.post("/api/v1/categories", data);

export const updateCategory = (id, data) =>
  client.patch(`/api/v1/categories/${id}`, data);

export const deleteCategory = (id) =>
  client.delete(`/api/v1/categories/${id}`);
