import client from "./client";

export const login = (email, password) =>
  client.post("/api/v1/auth/login", { email, password });

export const register = (email, password) =>
  client.post("/api/v1/auth/register", { email, password });

export const getMe = () => client.get("/api/v1/auth/me");
