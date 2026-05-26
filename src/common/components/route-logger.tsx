"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzAOPlLh_mDN4DlCCfmT4pQ31-suibcSdouOIDaj6VHRUWPuIX24NWTyZFS5HiOJDqu/exec";

function getOrCreateSessionId() {
  const key = "portfolio_session_id";
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export function RouteLogger() {
  const pathname = usePathname();
  const loggedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const path = pathname;
    const hash = window.location.hash;

    if (hash.includes("#dev")) return;
    if (pathname.startsWith("/portfolio-pdf")) return;
    if (loggedPaths.current.has(path)) return;

    loggedPaths.current.add(path);

    const payload = {
      type: "visit",
      path: `supporthub-admin : ${path}`,
      referrer: document.referrer || "",
      userAgent: window.navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      sessionId: getOrCreateSessionId(),
      visitedAt: new Date().toISOString(),
    };

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
