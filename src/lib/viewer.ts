import { v4 as uuidv4 } from "uuid";

export function getOrCreateViewerId() {
  if (typeof window === "undefined") return null; // SSR safe

  let viewerId = localStorage.getItem("dwec_viewerId");

  if (!viewerId) {
    viewerId = "web_" + uuidv4();
    localStorage.setItem("dwec_viewerId", viewerId);
  }

  return viewerId;
}
