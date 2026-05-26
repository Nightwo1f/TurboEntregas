export type LocalPhoto = {
  id: string;
  uri: string;
};

export function getPhotoLimit(plan: "FREE" | "VIP") {
  return plan === "VIP" ? 50 : 10;
}
