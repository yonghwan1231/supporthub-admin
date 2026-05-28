export function isRealtimeEnabled() {
  return process.env.SUPPORTHUB_ENABLE_REALTIME === "true";
}
