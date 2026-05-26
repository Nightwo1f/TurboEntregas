import { api } from "./api";

export type RoutePlanRequest = {
  batchId: string;
  originLatitude: number;
  originLongitude: number;
};

export function planRoute(payload: RoutePlanRequest, token: string) {
  return api("/routes/plan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}
