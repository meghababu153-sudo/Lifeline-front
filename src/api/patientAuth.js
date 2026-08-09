/**
 * src/api/patientAuth.js
 * Patient auth and profile API calls.
 *
 * All field names and endpoint paths match the BE-1 API contract exactly.
 */

import { api } from "./client.js";

/**
 * POST /patient/register
 * Claim a pre-existing patient account with an LFL code and password.
 * @param {string} lflCode   - e.g. "LFL-J6MTOC"
 * @param {string} password
 * @returns {object} patient object (without password_hash)
 */
export function registerPatient(lflCode, password) {
  return api.post("/patient/register", { lfl_code: lflCode, password });
}

/**
 * POST /patient/login
 * @param {string} lflCode
 * @param {string} password
 * @returns {{ access_token: string, token_type: string }}
 */
export function loginPatient(lflCode, password) {
  return api.post("/patient/login", { lfl_code: lflCode, password });
}

/**
 * GET /patient/profile
 * Returns the authenticated patient's full profile.
 * Uses patient_id from JWT — no query param needed.
 * @returns {{ id, patient_code, name, phone, email, date_of_birth,
 *             blood_group, emergency_contacts, conditions, created_at }}
 */
export function getPatientProfile() {
  return api.get("/patient/profile");
}

/**
 * PATCH /patient/profile
 * Updates the patient's own profile fields (partial update).
 * @param {object} data  - any subset of { blood_group, email, phone, emergency_contacts, conditions }
 * @returns {object} updated patient object
 */
export function updatePatientProfile(data) {
  return api.patch("/patient/profile", data);
}
