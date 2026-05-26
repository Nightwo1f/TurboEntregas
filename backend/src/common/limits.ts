export const PLAN_LIMITS = {
  FREE: 10,
  VIP: 50
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function getPlanPhotoLimit(plan: Plan) {
  return PLAN_LIMITS[plan];
}
