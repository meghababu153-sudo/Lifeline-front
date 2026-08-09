/**
 * src/api/auth.js
 * Auth API calls — doctor login, registration, verification, and /me.
 *
 * All field names and endpoint paths match the BE-1 API contract exactly.
 */

import { api } from "./client.js";

/**
 * POST /auth/login
 * @param {string} email
 * @param {string} password
 * @returns {{ access_token: string, token_type: string }}
 */
export function loginDoctor(email, password) {
  return api.post("/auth/login", { email, password });
}

/**
 * POST /auth/register
 * Registers a doctor account. med_reg_no is validated against the backend registry.
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @param {string} specialization
 * @param {string} medRegNo
 * @param {string} password
 * @returns {{ id: number, name: string, email: string, role: string, … }}
 */
export function registerDoctor(name, email, phone, specialization, medRegNo, password) {
  return api.post("/auth/register", {
    name,
    email,
    phone,
    specialization,
    med_reg_no: medRegNo,
    password,
    role: "doctor",
  });
}

/**
 * GET /auth/verify-registration?med_reg_no=XXX
 * Public endpoint — no auth required.
 * @param {string} medRegNo
 * @returns {{ valid: boolean, reason: string | null }}
 */
export function verifyRegistration(medRegNo) {
  return api.get(`/auth/verify-registration?med_reg_no=${encodeURIComponent(medRegNo)}`);
}

/**
 * GET /auth/me
 * Returns the currently authenticated user.
 * @returns {{ id: number, name: string, email: string, role: string, specialization?: string, phone?: string }}
 */
export function getMe() {
  return api.get("/auth/me");
}
