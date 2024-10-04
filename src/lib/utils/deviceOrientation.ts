// src/lib/utils/deviceOrientation.ts

import { writable } from "svelte/store";

export const deviceOrientation = writable({ alpha: 0, beta: 0, gamma: 0 });
export const deviceMotion = writable({ x: 0, y: 0, z: 0 });

export function initDeviceOrientation() {
  if (typeof window !== "undefined") {
    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", (event) => {
        deviceOrientation.set({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0,
        });
      });
    }

    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", (event) => {
        deviceMotion.set({
          x: event.accelerationIncludingGravity?.x || 0,
          y: event.accelerationIncludingGravity?.y || 0,
          z: event.accelerationIncludingGravity?.z || 0,
        });
      });
    }
  }
}
