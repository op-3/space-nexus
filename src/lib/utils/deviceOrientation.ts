// src/lib/utils/deviceOrientation.ts

import { writable } from "svelte/store";

export const deviceOrientation = writable({ alpha: 0, beta: 0, gamma: 0 });

export function initDeviceOrientation() {
  if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
    window.addEventListener("deviceorientation", (event) => {
      deviceOrientation.set({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    });
  }
}
