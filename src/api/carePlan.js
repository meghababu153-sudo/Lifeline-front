/**
 * src/api/carePlan.js
 * Care plan API calls.
 */

import { api } from "./client.js";

/**
 * GET /care-plan
 * Returns care plan items for the authenticated patient (JWT carries patient_id).
 * @returns {object[]} array of care plan item objects
 */
export function getCarePlan() {
  return api.get("/care-plan");
}

/**
 * PATCH /care-plan/{id}
 * Update the status of a care plan item.
 * @param {string} id      - care plan item UUID
 * @param {string} status  - lowercase: "pending" | "ongoing" | "completed"
 * @returns {object} updated care plan item
 */
export function updateCarePlanItem(id, status) {
  return api.patch(`/care-plan/${encodeURIComponent(id)}`, { status });
}
