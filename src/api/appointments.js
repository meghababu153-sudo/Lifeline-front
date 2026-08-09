/**
 * src/api/appointments.js
 * Appointments API calls — doctor side.
 */

import { api } from "./client.js";

/**
 * GET /appointments
 * Returns appointments for the authenticated doctor.
 * @returns {object[]} array of appointment objects
 */
export function getAppointments() {
  return api.get("/appointments");
}

/**
 * POST /appointments
 * Doctor creates an appointment for a patient (requires consent).
 * @param {object} data  - { patient_id, date, time, type, location?, notes? }
 * @returns {object} created appointment
 */
export function createAppointment(data) {
  return api.post("/appointments", data);
}

/**
 * PATCH /appointments/{id}
 * Update status, notes, or location of an appointment.
 * @param {string} id    - appointment UUID
 * @param {object} data  - { status?, notes?, location? }
 * @returns {object} updated appointment
 */
export function updateAppointment(id, data) {
  return api.patch(`/appointments/${encodeURIComponent(id)}`, data);
}
